from pydantic import BaseModel
from groq import Groq
import json

class Analyzer:
    def __init__(self):
        self.client = Groq()
    
    def analyze_words(self, transcript: str) -> dict:
        """Transkripti LLaMA3 kullanarak analiz eder."""
        prompt = f"""
Burada kullanıcının bir videoda konuştuğu bir video transkripti yer alıyor:

"{transcript}"

Lütfen bu transkripti incele ve metinde geçen HER BİR kelimeyi (bağlaçlar dahil) sayarak aşağıdaki gibi bir JSON formatında döndür. 
ÖNEMLİ KURALLAR:
1. Tüm kelimeleri TÜRKÇE KARAKTERLERİ ('ç', 'ğ', 'ı', 'ö', 'ş', 'ü') kesinlikle bozmadan koruyarak analiz et.
2. Kelimeleri Türkçe mantığına uygun bir şekilde tamamen KÜÇÜK HARFE çevir (Örn: "IŞIK" -> "ışık", "İSTANBUL" -> "istanbul", "AĞAÇ" -> "ağaç").
3. Noktalama işaretlerini kelimelerden temizle.

Sadece bu formatta JSON döndür, eksiği veya fazlası olmasın:
{{
    "total_words": int,       # Toplam kelime sayısı
    "word_frequencies": [      # Kullanılan tüm kelimeler ve kullanım sayıları (en çok kullanılandan en aza doğru sıralı)
       {{"word": "kelime", "count": 5}},
       {{"word": "başka", "count": 1}}
    ]
}}
"""
        
        response = self.client.chat.completions.create(
            model="llama-3.1-8b-instant",
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": "Sen yalnızca JSON döndüren duyarlı, akıllı bir analiz aracı asistanısın."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2, # Daha stabil cevap almak için
            max_tokens=1000
        )
        
        content = response.choices[0].message.content
        
        # Eğer LLaMA JSON dışında bir şey başa veya sona koyarsa temizle
        try:
            content = content[content.find('{') : content.rfind('}')+1]
            data = json.loads(content)
            return data
        except json.JSONDecodeError:
            raise ValueError("Yapay Zeka JSON verisini bozuk döndürdü. Lütfen tekrar deneyin.")