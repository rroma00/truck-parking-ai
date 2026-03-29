"""
FastAPI server — handles Twilio webhook and WebSocket for Media Streams.

Endpoints:
  POST /twiml   — Twilio calls this when a call comes in; returns TwiML that
                  opens a Media Stream WebSocket back to this server.
  WS   /ws      — Twilio streams μ-law audio here; Pipecat pipeline runs here.
"""

import json
import os

import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI, WebSocket
from fastapi.responses import Response
from loguru import logger

from bot import run_bot

load_dotenv()

BOT_HOST = os.environ["BOT_HOST"]   # e.g. "my-bot.up.railway.app"  (no scheme)

app = FastAPI()


@app.post("/twiml")
async def twiml_webhook():
    """Return TwiML that opens a bidirectional Media Stream WebSocket."""
    xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="wss://{BOT_HOST}/ws" track="inbound_track">
      <Parameter name="asr_language" value="en-US"/>
    </Stream>
  </Connect>
</Response>"""
    return Response(content=xml, media_type="text/xml")


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    logger.info("Twilio WebSocket connected — waiting for start message")

    stream_sid = None
    try:
        # Twilio sends a 'connected' message first, then a 'start' message
        # containing the stream_sid. Read until we get it.
        async for raw in websocket.iter_text():
            msg = json.loads(raw)
            event = msg.get("event")
            if event == "connected":
                logger.info("Twilio: connected")
                continue
            if event == "start":
                stream_sid = msg["start"]["streamSid"]
                logger.info(f"Twilio: stream started sid={stream_sid}")
                break
            # Ignore anything else (e.g. early media frames)

        if not stream_sid:
            logger.error("Never received Twilio start message — closing")
            return

        await run_bot(websocket, stream_sid)
    except Exception as e:
        logger.error(f"Bot error: {e}")
    finally:
        logger.info("Twilio WebSocket closed")


@app.get("/health")
async def health():
    return {"status": "ok"}


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("server:app", host="0.0.0.0", port=port, log_level="info")
