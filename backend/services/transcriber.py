import os
import subprocess
from groq import Groq
import tempfile

class AudioTranscriber:
    def __init__(self):
        # API key should be in .env: GROQ_API_KEY
        self.client = Groq()

    def extract_audio(self, video_path: str) -> str:
        """Videodan sesi ayırır ve geçici bir MP3 dosyası yolu döndürür."""
        temp_audio = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
        temp_audio_path = temp_audio.name
        temp_audio.close()

        command = [
            "ffmpeg",
            "-i", video_path,
            "-q:a", "0",
            "-map", "a",
            "-y", # Overwrite
            temp_audio_path
        ]
        
        try:
            subprocess.run(command, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            return temp_audio_path
        except subprocess.CalledProcessError as e:
            if os.path.exists(temp_audio_path):
                os.remove(temp_audio_path)
            raise RuntimeError(f"FFmpeg error: {e}")

    def transcribe(self, audio_path: str) -> str:
        """Groq Whisper API kullanarak sesi metne çevirir."""
        with open(audio_path, "rb") as file:
            transcription = self.client.audio.transcriptions.create(
                file=(audio_path, file.read()),
                model="whisper-large-v3",
                prompt="Bu kayıt Türkçe dilindedir.", # Türkçe algılamayı güçlendirmek için
                response_format="verbose_json",
            )
        return transcription.text
