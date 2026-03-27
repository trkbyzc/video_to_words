from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import shutil
import tempfile

from services.transcriber import AudioTranscriber
from ai.analyzer import Analyzer

load_dotenv()

app = FastAPI(title="Video Word Usage API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

transcriber_service = AudioTranscriber()
analyzer_service = Analyzer()

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Video Analysis Backend is running."}

@app.post("/api/analyze-video")
async def analyze_video(video: UploadFile = File(...)):
    if not video.filename:
        raise HTTPException(status_code=400, detail="No video file provided.")
    
    try:
        temp_video = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4")
        temp_video_path = temp_video.name
        with open(temp_video_path, "wb") as buffer:
            shutil.copyfileobj(video.file, buffer)
        temp_video.close()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save video: {str(e)}")

    temp_audio_path = None
    
    try:
        temp_audio_path = transcriber_service.extract_audio(temp_video_path)
        transcript_text = transcriber_service.transcribe(temp_audio_path)
        analysis_result = analyzer_service.analyze_words(transcript_text)
        
        return {
            "transcript": transcript_text,
            "analysis": analysis_result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_video_path):
            os.remove(temp_video_path)
        if temp_audio_path and os.path.exists(temp_audio_path):
            os.remove(temp_audio_path)
