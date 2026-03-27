
"use client";

import { useState, useRef } from "react";
import { UploadCloud, FileVideo, Activity, BrainCircuit, Type, AlertCircle, RefreshCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("video", file);

    try {
      // Backend URL (lokal geli�tirme i�in localhost:8000)
      const res = await fetch("http://localhost:8000/api/analyze-video", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Video analiz edilirken bir hata olu�tu.");
      }

      const data = await res.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message || "Sunucuya ba�lan�lamad�.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setResults(null);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-indigo-600 sm:text-5xl border-b-2 border-indigo-100 pb-4 inline-block">
            AI Video Konu�ma Analizi
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Videonuzu y�kleyin, yapay zeka ne anlatt���n�z�, kelime da�arc���n�z� ve kulland���n�z dolgu kelimelerini (���, eee, yani vb.) analiz etsin.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!results ? (
            <motion.div
              key="upload-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => !loading && fileInputRef.current?.click()}
                className={`border-4 border-dashed rounded-xl p-12 transition-all cursor-pointer flex flex-col items-center justify-center text-center
                  ${file ? "border-indigo-500 bg-indigo-50" : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"}
                  ${loading ? "opacity-50 pointer-events-none" : ""}
                `}
              >
                <input
                  type="file"
                  className="hidden"
                  accept="video/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                
                {file ? (
                  <>
                    <FileVideo className="w-16 h-16 text-indigo-500 mb-4" />
                    <p className="text-xl font-semibold text-indigo-900">{file.name}</p>
                    <p className="text-sm text-indigo-500 mt-2">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-16 h-16 text-gray-400 mb-4" />
                    <p className="text-xl font-medium text-gray-700">Video dosyan�z� buraya s�r�kleyin</p>
                    <p className="text-sm text-gray-500 mt-2">Veya se�mek i�in t�klay�n (MP4, MOV, vb.)</p>
                  </>
                )}
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg flex items-start text-red-700">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleUpload}
                  disabled={!file || loading}
                  className={`flex items-center px-8 py-3 rounded-lg text-white font-medium text-lg transition-all
                    ${!file || loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg"}
                  `}
                >
                  {loading ? (
                    <>
                      <RefreshCcw className="w-5 h-5 mr-3 animate-spin" />
                      Yapay Zeka Video Analiz Ediyor...
                    </>
                  ) : (
                    <>
                      <Activity className="w-5 h-5 mr-3" />
                      Analizi Ba�lat
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Analiz Sonu�lar�</h2>
                <button
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center"
                >
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Yeni Video Analiz Et
                </button>
              </div>

              {/* İstatistik Kartları */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow p-6 flex items-center border-l-4 border-blue-500">
                  <Type className="w-12 h-12 text-blue-100 fill-blue-500 mr-4" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Toplam Kelime Say�s�</p>
                    <p className="text-3xl font-bold text-gray-900">{results.analysis?.total_words}</p>
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow p-6 flex items-center border-l-4 border-orange-500">
                  <AlertCircle className="w-12 h-12 text-orange-100 fill-orange-500 mr-4" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Dolgu Kelimesi (���, eee, yani)</p>
                    <p className="text-3xl font-bold text-gray-900">{results.analysis?.total_filler_words}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* En Çok Kullanılan Kelimeler */}
                <div className="bg-white rounded-2xl shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-indigo-500" />
                    En S�k Kullan�lan Kelimeler
                  </h3>
                  <ul className="space-y-3">
                    {results.analysis?.word_frequencies?.map((w: any, i: number) => (
                      <li key={i} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                        <span className="font-medium text-gray-700">{w.word}</span>
                        <span className="bg-indigo-100 text-indigo-700 py-1 px-3 rounded-full text-sm font-bold">
                          {w.count} kez
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Dolgu Kelimeleri Listesi */}
                <div className="bg-white rounded-2xl shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 text-orange-500" />
                    Dolgu Kelimeleri Analizi
                  </h3>
                  {results.analysis?.filler_frequencies?.length > 0 ? (
                    <ul className="space-y-3">
                      {results.analysis?.filler_frequencies?.map((f: any, i: number) => (
                        <li key={i} className="flex justify-between items-center bg-orange-50 p-3 rounded-lg">
                          <span className="font-medium text-orange-800">{f.word}</span>
                          <span className="bg-orange-200 text-orange-800 py-1 px-3 rounded-full text-sm font-bold">
                            {f.count} kez
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic p-4 text-center bg-gray-50 rounded-lg">
                      Harika! Hi� dolgu kelimesi (���, eee) tespit edilmedi.
                    </p>
                  )}
                </div>
              </div>

              {/* AI Geribildirim */}
              <div className="bg-indigo-900 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
                <BrainCircuit className="absolute -right-6 -top-6 w-32 h-32 text-indigo-800 opacity-50" />
                <h3 className="text-xl font-bold mb-3 flex items-center relative z-10">
                  <BrainCircuit className="w-6 h-6 mr-2 text-indigo-300" />
                  Yapay Zeka De�erlendirmesi
                </h3>
                <p className="text-lg text-indigo-100 leading-relaxed relative z-10">
                  {results.analysis?.contextual_feedback}
                </p>
              </div>

              {/* Transkript */}
              <div className="bg-white rounded-2xl shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Videonun Transkripti</h3>
                <div className="p-4 bg-gray-50 rounded-xl text-gray-600 leading-relaxed max-h-64 overflow-y-auto">
                  {results.transcript}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

