
"use client";

import { useState, useRef } from "react";
import { UploadCloud, FileVideo, BarChart3, FileText, RefreshCcw, Loader2 } from "lucide-react";
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/analyze-video`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Video analiz edilirken bir hata oluştu.");
      }

      const data = await res.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message || "Sunucuya bağlanılamadı.");
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
    <main className="min-h-screen bg-[#112344] text-slate-100 py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto relative">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light tracking-tight text-white sm:text-5xl pb-4">
            <span className="font-bold">Videodan</span> Kelimelere
          </h1>
        </div>

        {results && (
          <button
            onClick={resetForm}
            className="absolute -top-6 right-0 px-5 py-2.5 bg-[#1a3360] text-slate-200 hover:bg-[#203c73] hover:text-white rounded-md text-sm font-medium transition-all shadow-sm border border-[#26447d] flex items-center"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Yeni Video Yükle
          </button>
        )}

        <AnimatePresence mode="wait">
          {!results ? (
            <motion.div
              key="upload-section"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-[#172c54] rounded-xl shadow-xl border border-[#223d70] p-10"
            >
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => !loading && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-16 transition-all cursor-pointer flex flex-col items-center justify-center text-center
                  ${file ? "border-sky-300 bg-[#1d3563]" : "border-[#30518f] hover:border-[#4068b5] hover:bg-[#1a325e]"}
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
                    <FileVideo className="w-16 h-16 text-white mb-4" strokeWidth={1.5} />
                    <p className="text-xl font-medium text-white">{file.name}</p>
                    <p className="text-sm text-slate-300 mt-2">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-16 h-16 text-slate-400 mb-4" strokeWidth={1.5} />
                    <p className="text-xl font-medium text-white">Video dosyasını buraya sürükleyin</p>
                    <p className="text-sm text-slate-300 mt-2">veya bilgisayarınızdan seçmek için tıklayın (MP4, MOV)</p>
                  </>
                )}
              </div>

              {error && (
                <div className="mt-6 p-4 bg-red-900/50 border border-red-800 rounded-md text-red-200 flex items-start text-sm">
                  <p>{error}</p>
                </div>
              )}

              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleUpload}
                  disabled={!file || loading}
                  className={`flex items-center px-10 py-3.5 rounded-md font-bold transition-all
                    ${!file || loading ? "bg-[#25427b] text-slate-400 cursor-not-allowed" : "bg-white text-[#112344] hover:bg-slate-100 shadow-md"}
                  `}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                      Sistem Videoyu İşliyor...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-5 h-5 mr-3" />
                      Dökümü ve Analizi Başlat
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results-section"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                {/* Kelime Listesi (Sol Taraf) */}
                <div className="md:col-span-1 bg-[#172c54] rounded-xl shadow-xl border border-[#223d70] overflow-hidden flex flex-col h-[600px]">
                  <div className="bg-[#1a3360] py-4 px-5 border-b border-[#223d70]">
                    <h3 className="font-semibold text-white flex items-center text-sm">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Kelime Frekansları
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">Toplam: <span className="font-bold text-white">{results.analysis?.total_words}</span> kelime</p>
                  </div>
                  
                  <div className="overflow-y-auto flex-1 p-2">
                    <ul className="space-y-1">
                      {[...(results.analysis?.word_frequencies || [])]
                        .sort((a, b) => b.count - a.count)
                        .map((w: any, i: number) => (
                        <li key={i} className="flex justify-between items-center py-2 px-3 hover:bg-[#1a325e] rounded-md transition-colors border-b border-[#223d70] last:border-0">
                          <span className="text-sm font-medium text-slate-100 truncate pr-2" title={w.word}>{w.word}</span>
                          <span className="bg-white text-[#112344] py-0.5 px-2 rounded text-xs font-bold shrink-0">
                            {w.count}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Transkript (Sağ Taraf) */}
                <div className="md:col-span-3 bg-[#172c54] rounded-xl shadow-xl border border-[#223d70] overflow-hidden flex flex-col h-[600px]">
                  <div className="bg-[#1a3360] py-4 px-6 border-b border-[#223d70]">
                    <h3 className="font-semibold text-white flex items-center text-sm">
                      <FileText className="w-4 h-4 mr-2" />
                      Konuşma Dökümü (Transkript)
                    </h3>
                  </div>
                  <div className="p-6 overflow-y-auto flex-1 bg-[#172c54]">
                    <p className="text-slate-200 leading-relaxed text-sm md:text-base font-light whitespace-pre-wrap">
                      {results.transcript}
                    </p>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
