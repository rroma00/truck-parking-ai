"""
FastAPI server — handles Twilio webhook and WebSocket for Media Streams.

Endpoints:
  POST /twiml   — Twilio calls this when a call comes in; returns TwiML that
                  opens a Media Stream WebSocket back to this server.
  WS   /ws      — Twilio streams μ-law audio here; Pipecat pipeline runs here.
"""

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
    """Return TwiML that connects the caller to our WebSocket pipeline."""
    xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="wss://{BOT_HOST}/ws" />
  </Connect>
  <Pause length="60"/>
</Response>"""
    return Response(content=xml, media_type="text/xml")


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    logger.info("Twilio WebSocket connected")
    try:
        await run_bot(websocket)
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
