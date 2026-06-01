'use client';

import { useState } from 'react';

export default function ImageTab() {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState('1024x1024');
  const [quality, setQuality] = useState('standard');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setImage(null);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, size, quality }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setImage(data.image.url);
      }
    } catch {
      setError('生成失败，请检查 API Key 配置');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-4">DALL-E 3 图像生成</h2>

      <div className="space-y-4">
        {/* Prompt */}
        <div>
          <label className="block text-sm font-medium mb-2">描述你想要的图像</label>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="例如：一只可爱的橘猫在樱花树下睡觉，日系动漫风格..."
            className="textarea"
            rows={3}
          />
        </div>

        {/* Options */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">尺寸</label>
            <select value={size} onChange={e => setSize(e.target.value)} className="select w-full">
              <option value="1024x1024">1024×1024 (正方形)</option>
              <option value="1024x1792">1024×1792 (竖版)</option>
              <option value="1792x1024">1792×1024 (横版)</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">质量</label>
            <select value={quality} onChange={e => setQuality(e.target.value)} className="select w-full">
              <option value="standard">标准</option>
              <option value="hd">高清 (HD)</option>
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateImage}
          disabled={loading || !prompt.trim()}
          className="btn-primary w-full"
        >
          {loading ? '生成中...' : '生成图像'}
        </button>

        {/* Error */}
        {error && (
          <div className="p-4 bg-danger/10 border border-danger/20 rounded-lg text-danger text-sm">
            {error}
          </div>
        )}

        {/* Result */}
        {image && (
          <div className="animate-fade-in">
            <label className="block text-sm font-medium mb-2">生成结果</label>
            <div className="relative rounded-xl overflow-hidden border border-border">
              <img src={image} alt="Generated" className="w-full h-auto" />
              <a
                href={image}
                download
                className="absolute bottom-4 right-4 btn-primary text-sm"
              >
                下载图片
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
