'use client';

import { useState, useRef } from 'react';

export default function VisionTab() {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('请详细描述这张图片的内容');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!image) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image, prompt }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResult(data.result);
      }
    } catch {
      setError('分析失败，请检查 API Key 配置');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-4">GPT-4 Vision 图像分析</h2>

      <div className="space-y-4">
        {/* Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">上传图片</label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-colors"
          >
            {image ? (
              <img src={image} alt="Uploaded" className="max-h-64 mx-auto rounded-lg" />
            ) : (
              <div className="text-muted">
                <span className="text-4xl">📷</span>
                <p className="mt-2">点击上传图片</p>
                <p className="text-xs mt-1">支持 JPG、PNG、GIF、WebP</p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Prompt */}
        <div>
          <label className="block text-sm font-medium mb-2">分析提示词</label>
          <input
            type="text"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="你想要AI如何分析这张图片？"
            className="input"
          />
        </div>

        {/* Analyze Button */}
        <button
          onClick={analyzeImage}
          disabled={loading || !image}
          className="btn-primary w-full"
        >
          {loading ? '分析中...' : '分析图片'}
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
            <label className="block text-sm font-medium mb-2">分析结果</label>
            <div className="p-4 bg-card-hover rounded-xl border border-border whitespace-pre-wrap">
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
