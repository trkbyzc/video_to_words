# Videodan Kelimelere — Yapay Zeka Destekli Konuşma Analizi

**[▶ Canlı Demo — video-to-words.vercel.app](https://video-to-words.vercel.app/)**

![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-Whisper%20%C2%B7%20Llama%203-F55036)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)

Modern, temiz ve kurumsal bir arayüze sahip yapay zeka destekli video transkript ve kelime analizi platformu.

Kullanıcılar konuşma videolarını sisteme yükleyerek, tüm metnin yazılı dökümünü alabilir ve hangi kelimenin kaç defa kullanıldığını sayısal bir frekans tablosu olarak elde edebilir. Özel olarak kurumsal iletişim analizleri ve detaylı konuşma raporlamaları için geliştirilmiştir.

## Canlı Sistem (Production)

Proje ücretsiz katman sunucular üzerinde yayındadır.

| Katman | Adres | Barındırma |
|--------|-------|------------|
| **Frontend** | [video-to-words.vercel.app](https://video-to-words.vercel.app/) | Vercel |
| **Backend API** | — | Render (Docker) |

> **Not:** Ücretsiz Render sunucusu 15 dakika kullanılmadığında uyku moduna geçer. Uyku modundayken yapılan **ilk** video yükleme işleminde sistemin uyanması 1-2 dakika sürebilir; sonraki işlemler saniyeler içinde yanıtlanır.

## Özellikler

- **Video Ses Dönüşümü:** Yüklenen video üzerinden (MP4, MOV) otonom olarak (FFmpeg) çok hızlı bir şekilde ses ayrıştırılır.
- **Yüksek Hızlı Transkript:** Groq Whisper-Large-v3 modeli ile uzun konuşmalar saniyeler içerisinde hatasız Türkçe metne dökülür.
- **Kelime Dağılımı ve Frekans:** Llama 3 Modelleri ile söylenen konuşmadaki frekans analizi çıkartılır, raporlanır.
- **Kurumsal Temalı Arayüz:** Next.js ve Tailwind CSS ile koyu lacivert tonlarda oluşturulmuş, Premium hissiyat yaşatan akıcı UI. (Framer Motion ile desteklenmiştir)
- **Güvenli Mimari:** Videolar diski doldurmaz, analiz bittiği saniye sunucudan otomatik silinir.

## Mimari ve Teknolojiler

- **Frontend:** Next.js (App Router, Root Dizini), Tailwind CSS, Lucide React, Framer Motion
- **Backend:** Python, FastAPI, Uvicorn, Render Docker Container (/backend dizininde izole)
- **Yapay Zeka (AI):** Groq API (Bilinen en hızlı AI çip sağlayıcısı)
- **Bağımlılık:** FFmpeg (Backend tarafında Docker üzerinden otomatik kurulur)

## Geliştirici Ortamı (Local Kurulum)

Kendi bilgisayarınızda çalıştırmak isterseniz:

### 1. Backend (Python/FastAPI) Kurulumu
İşletim sisteminizde FFmpeg'in yüklü olduğundan (ve PATH'e ekli olduğundan) emin olun.

```bash
cd backend
# Gerekli bağımlılıkları yükleyin
pip install -r requirements.txt

# .env dosyanızı oluşturun ve API Anahtarınızı girin
echo "GROQ_API_KEY=gsk_sizin_api_anahtariniz" > .env

# Sunucuyu başlatın
uvicorn main:app --reload
```
Backend `http://localhost:8000` adresinde çalışmaya başlayacaktır.

### 2. Frontend (Next.js) Kurulumu
Ayrı bir terminalde direkt projenin ana dizininde (Root):

```bash
# Gerekli kütüphaneleri yükleyin
npm install

# Yerel geliştirme ortamında çalışırken backend adresini belirtin:
# (Windows CMD için: set NEXT_PUBLIC_API_URL=http://localhost:8000)
# (Mac/Linux için: export NEXT_PUBLIC_API_URL=http://localhost:8000)

# Arayüzü başlatın
npm run dev
```
Frontend `http://localhost:3000` adresinde çalışacaktır.
