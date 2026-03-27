# Videodan Kelimelere - Yapay Zeka Destekli Konuşma Analizi

Modern, temiz ve kurumsal bir arayüze sahip yapay zeka destekli video transkript ve kelime analizi platformu. 

Kullanıcılar konuşma videolarını sisteme yükleyerek, tüm metnin yazılı dökümünü alabilir ve hangi kelimenin kaç defa kullanıldığını sayısal bir frekans tablosu olarak elde edebilir. Özel olarak siyasi partiler ve kurumsal iletişim analizleri için optimize edilmiştir.

## 🚀 Özellikler

- **Video Ses Dönüşümü:** Yüklenen video (MP4, MOV) üzerinden ses ayrıştırma işlemi \fmpeg\ kullanılarak otonom yapılır.
- **Yüksek Hızlı Transkript:** Groq Whisper-Large-V3 modeli ile saniyeler içerisinde hatasız Türkçe transkript.
- **Kelime Dağılımı ve Frekans:** Llama-3.1-8b modeli kullanılarak, bağlaçlar dahil ekranda söylenen tüm kelimelerin büyük-küçük harf bağımsız şekilde analizi ve sayımı.
- **Kurumsal Arayüz:** Next.js ve Tailwind CSS ile tamamen koyu lacivert tonlarda oluşturulmuş, Premium hissiyat yaşatan akıcı UI. (Framer Motion animasyonları ile destekli)
- **Güçlü Mimari:** Frontend ve Backend tamamen birbirinden izole edilmiştir.

## 🛠️ Kullanılan Teknolojiler

- **Frontend:** Next.js (React), Tailwind CSS, Lucide React, Framer Motion
- **Backend:** Python, FastAPI, Uvicorn, Python-Multipart
- **Yapay Zeka (AI):** Groq API (Whisper-Large-V3 ve Llama-3.1-8B)
- **Sistem İçi Araçlar:** FFmpeg

## ⚙️ Gereksinimler

Projenin bilgisayarınızda veya sunucunuzda çalışabilmesi için aşağıdakilerin kurulu olması gerekir:
- Node.js (v18+)
- Python (v3.8+)
- **FFmpeg** (Sistem PATH yoluna eklenmiş olmalıdır, video işleme için şarttır)
- Bir Groq API Anahtarı

## 💻 Kurulum ve Çalıştırma

### 1. Backend (Python/FastAPI) Kurulumu

\\\ash
cd backend
# Gerekli kütüphaneleri yükleyin
pip install -r requirements.txt

# .env dosyanızı oluşturun ve API Anahtarınızı girin
echo "GROQ_API_KEY=sizin_api_anahtariniz_buraya" > .env

# Sunucuyu başlatın (http://localhost:8000 portunda çalışır)
uvicorn main:app --reload
\\\

### 2. Frontend (Next.js) Kurulumu

Backend sunucusu çalışırken yeni bir terminal açın:

\\\ash
cd frontend
# Paketleri yükleyin
npm install

# Arayüzü başlatın (http://localhost:3000 portunda çalışır)
npm run dev
\\\

## 📌 Kullanım Bilgileri
Tarayıcınızdan \http://localhost:3000\ adresine gidin. Miting, toplantı veya konuşma videonuzu sürükleyip bırakın ve analizi başlatın. Gerekli işlemler tamamlandıktan sonra sonuçlar ekranınıza düşecektir.
