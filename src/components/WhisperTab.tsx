'use client';

import { useState, useRef } from 'react';

export default function WhisperTab() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const file = new File([blob], 'recording.webm', { type: 'audio/webm' });
        setFile(file);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setRecording(true);
    } catch {
      setError('无法访问麦克风，请检查权限设置');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const transcribe = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResult(data.text);
      }
    } catch {
      setError('转录失败，请检查 API Key 配置');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-4">Whisper 语音转文字</h2>

      <div className="space-y-4">
        {/* Upload or Record */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">上传音频文件</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary transition-colors"
            >
              <span className="text-3xl">📁</span>
              <p className="mt-2 text-sm text-muted">
                {file ? file.name : '点击上传音频'}
              </p>
              <p className="text-xs text-muted mt-1">支持 MP3、WAV、M4A、WebM</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Recording */}
          <div>
            <label className="block text-sm font-medium mb-2">实时录音</label>
            <div className="border-2 border-border rounded-xl p-6 text-center">
              <button
                onClick={recording ? stopRecording : startRecording}
                className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center text-2xl transition-all ${
                  recording
                    ? 'bg-danger animate-pulse'
                    : 'bg-primary hover:bg-primary-hover'
                }`}
              >
                {recording ? '⏹️' : '🎤'}
              </button>
              <p className="mt-3 text-sm text-muted">
                {recording ? '点击停止录音' : '点击开始录音'}
              </p>
            </div>
          </div>
        </div>

        {/* Transcribe Button */}
        <button
          onClick={transcribe}
          disabled={loading || !file}
          className="btn-primary w-full"
        >
          {loading ? '转录中...' : '开始转录'}
        </button>

        {/* Error */}
        {error && (
          <div className="p-4 bg-danger/10 border border-danger/20 rounded-lg text-danger text-sm">
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="animate-fade-in">
            <label className="block text-sm font-medium mb-2">转录结果</label>
            <div className="p-4 bg-card-hover rounded-xl border border-border whitespace-pre-wrap">
              {result}
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(result)}
              className="btn-secondary text-sm mt-2"
            >
              复制文本
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
