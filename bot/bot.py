"""
Pipecat voice-bot pipeline for truck parking reservations.

Flow:
  Twilio μ-law audio → Deepgram STT → Claude LLM (with tools) → Cartesia TTS → Twilio

Tools available to Claude:
  check_availability   — GET  /api/locations
  book_reservation     — POST /api/reservations  +  Twilio SMS confirmation
"""

import asyncio
import json
import os
from typing import Any

import aiohttp
from dotenv import load_dotenv
from fastapi import WebSocket
from loguru import logger
from twilio.rest import Client as TwilioClient

from pipecat.audio.vad.silero import SileroVADAnalyzer
from pipecat.pipeline.pipeline import Pipeline
from pipecat.pipeline.runner import PipelineRunner
from pipecat.pipeline.task import PipelineParams, PipelineTask
from pipecat.processors.aggregators.openai_llm_context import OpenAILLMContext
from pipecat.serializers.twilio import TwilioFrameSerializer
from pipecat.services.anthropic.llm import AnthropicLLMService
from pipecat.services.cartesia.tts import CartesiaTTSService
from pipecat.services.deepgram.stt import DeepgramSTTService
from pipecat.transports.websocket.fastapi import (
    FastAPIWebsocketParams,
    FastAPIWebsocketTransport,
)

load_dotenv()

# ─── Configuration ────────────────────────────────────────────────────────────

BACKEND_URL     = os.environ.get("BACKEND_URL", "https://truck-parking-ai-production.up.railway.app")
ANTHROPIC_KEY   = os.environ["ANTHROPIC_API_KEY"]
DEEPGRAM_KEY    = os.environ["DEEPGRAM_API_KEY"]
CARTESIA_KEY    = os.environ["CARTESIA_API_KEY"]
TWILIO_SID      = os.environ["TWILIO_ACCOUNT_SID"]
TWILIO_TOKEN    = os.environ["TWILIO_AUTH_TOKEN"]
TWILIO_NUMBER   = os.environ.get("TWILIO_PHONE_NUMBER", "+18556845491")

twilio_client = TwilioClient(TWILIO_SID, TWILIO_TOKEN)

# ─── System prompt ────────────────────────────────────────────────────────────

SYSTEM_PROMPT = """You are ParkFlow, a friendly AI assistant for a truck parking facility, handling inbound phone calls. Your job is to help truck drivers check availability and book parking spots.

Guidelines:
- Keep responses SHORT — this is a live phone call. One or two sentences max.
- Be warm, professional, and direct.
- Always greet the caller first, then ask how you can help.
- When checking availability, call check_availability and report the location name, available spots, and nightly rate.
- When a driver wants to book, collect their full name and call-back phone number before calling book_reservation.
- After booking, confirm: driver name, location, and confirmation number.
- If no spots are available, apologize and let them know you'll have availability soon.
- Do not make up spot counts or prices — always use the tool data.
- End the call politely once the booking is complete or the driver has what they need.
"""

# ─── Tool definitions (Anthropic / OpenAI schema) ─────────────────────────────

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "check_availability",
            "description": (
                "Check available truck parking spots and pricing across all locations. "
                "Call this whenever the driver asks about availability, open spots, or pricing."
            ),
            "parameters": {
                "type": "object",
                "properties": {},
                "required": [],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "book_reservation",
            "description": (
                "Book a parking spot for a truck driver. "
                "Use only after collecting the driver's full name and phone number. "
                "Sends an SMS confirmation automatically."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "location_id": {
                        "type": "string",
                        "description": "The UUID of the parking location from check_availability.",
                    },
                    "customer_name": {
                        "type": "string",
                        "description": "Driver's full name.",
                    },
                    "phone_number": {
                        "type": "string",
                        "description": "Driver's phone number in E.164 format, e.g. +15551234567.",
                    },
                    "notes": {
                        "type": "string",
                        "description": "Optional notes about the reservation.",
                    },
                },
                "required": ["location_id", "customer_name", "phone_number"],
            },
        },
    },
]

# ─── Tool handlers ────────────────────────────────────────────────────────────

async def check_availability(
    function_name: str,
    tool_call_id: str,
    args: dict[str, Any],
    llm: Any,
    context: Any,
    result_callback: Any,
) -> None:
    """Fetch all locations + availability from the backend."""
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{BACKEND_URL}/api/locations", timeout=aiohttp.ClientTimeout(total=8)) as resp:
                payload = await resp.json()

        locations = payload.get("data", [])
        if not locations:
            await result_callback({"available": False, "message": "No locations found."})
            return

        results = []
        for loc in locations:
            available = loc.get("available_spots") or loc.get("total_spots", 0)
            rate = loc.get("daily_rate") or loc.get("overnight_price")
            results.append({
                "location_id":   loc.get("id"),
                "name":          loc.get("location_name") or loc.get("name"),
                "address":       loc.get("address"),
                "available_spots": available,
                "total_spots":   loc.get("total_spots"),
                "nightly_rate":  rate,
            })

        await result_callback({"locations": results})
    except Exception as e:
        logger.error(f"check_availability error: {e}")
        await result_callback({"error": "Could not fetch availability. Please try again."})


async def book_reservation(
    function_name: str,
    tool_call_id: str,
    args: dict[str, Any],
    llm: Any,
    context: Any,
    result_callback: Any,
) -> None:
    """Create a reservation via the backend API, then send an SMS confirmation."""
    try:
        payload = {
            "location_id":   args["location_id"],
            "customer_name": args["customer_name"],
            "phone_number":  args["phone_number"],
            "vehicle_type":  "truck",
            "source":        "voice",
            "notes":         args.get("notes", "Booked via AI voice call"),
        }

        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{BACKEND_URL}/api/reservations",
                json=payload,
                timeout=aiohttp.ClientTimeout(total=10),
            ) as resp:
                result = await resp.json()

        if not result.get("success"):
            raise ValueError(result.get("error", "Booking failed"))

        reservation = result["data"]
        confirmation_id = str(reservation.get("id", ""))[:8].upper()

        # Send SMS confirmation
        sms_body = (
            f"ParkFlow Confirmation #{confirmation_id}\n"
            f"Name: {args['customer_name']}\n"
            f"Your truck parking spot has been reserved. "
            f"Reply HELP to reach dispatch."
        )
        try:
            twilio_client.messages.create(
                body=sms_body,
                from_=TWILIO_NUMBER,
                to=args["phone_number"],
            )
            logger.info(f"SMS sent to {args['phone_number']}")
        except Exception as sms_err:
            logger.warning(f"SMS send failed (booking still succeeded): {sms_err}")

        await result_callback({
            "success": True,
            "confirmation_id": confirmation_id,
            "customer_name":   args["customer_name"],
            "phone_number":    args["phone_number"],
            "sms_sent":        True,
        })
    except Exception as e:
        logger.error(f"book_reservation error: {e}")
        await result_callback({"success": False, "error": str(e)})


# ─── Pipeline ─────────────────────────────────────────────────────────────────

async def run_bot(websocket: WebSocket) -> None:
    """Build and run the full Pipecat pipeline for a single call."""

    # The TwilioFrameSerializer reads the stream_sid from the first Twilio
    # 'connected' message on the WebSocket. We pass it in after init.
    serializer = TwilioFrameSerializer()

    transport = FastAPIWebsocketTransport(
        websocket=websocket,
        params=FastAPIWebsocketParams(
            audio_in_enabled=True,
            audio_out_enabled=True,
            add_wav_header=False,
            vad_enabled=True,
            vad_analyzer=SileroVADAnalyzer(),
            vad_audio_passthrough=True,
            serializer=serializer,
        ),
    )

    stt = DeepgramSTTService(
        api_key=DEEPGRAM_KEY,
        # Deepgram model optimised for phone audio
        params=DeepgramSTTService.InputParams(
            language="en-US",
            model="nova-2-phonecall",
        ),
    )

    llm = AnthropicLLMService(
        api_key=ANTHROPIC_KEY,
        model="claude-sonnet-4-6",
    )

    # Register tool handlers
    llm.register_function("check_availability", check_availability)
    llm.register_function("book_reservation", book_reservation)

    tts = CartesiaTTSService(
        api_key=CARTESIA_KEY,
        # Professional US English male voice
        voice_id="a0e99841-438c-4a64-b679-ae501e7d6091",
        params=CartesiaTTSService.InputParams(
            speed="normal",
            emotion=[],
        ),
    )

    messages = [
        {
            "role": "system",
            "content": SYSTEM_PROMPT,
        },
        {
            "role": "user",
            "content": "The phone is ringing. Greet the caller warmly and ask how you can help.",
        },
    ]

    context = OpenAILLMContext(messages=messages, tools=TOOLS)
    context_aggregator = llm.create_context_aggregator(context)

    pipeline = Pipeline(
        [
            transport.input(),
            stt,
            context_aggregator.user(),
            llm,
            tts,
            transport.output(),
            context_aggregator.assistant(),
        ]
    )

    task = PipelineTask(
        pipeline,
        params=PipelineParams(allow_interruptions=True),
    )

    @transport.event_handler("on_client_connected")
    async def on_connected(transport, client):
        logger.info("Client connected — starting greeting")
        await task.queue_frames([context_aggregator.user().get_context_frame()])

    @transport.event_handler("on_client_disconnected")
    async def on_disconnected(transport, client):
        logger.info("Client disconnected")
        await task.cancel()

    runner = PipelineRunner(handle_sigint=False)
    await runner.run(task)
