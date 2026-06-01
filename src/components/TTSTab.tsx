'use client';

import { useState, useRef } from 'react';

const voices = [
  { id: 'alloy', name: 'Alloy', description: '中性、平衡' },
  { id: 'echo', name: 'Echo', description: '深沉、有力' },
  { id: 'fable', name: 'Fable', description: '温暖、叙事' },
  { id: 'onyx', name: 'Onyx', description: '低沉、权威' },
  { id: 'nova', name: 'Nova', description: '年轻、活力' },
  { id: 'shimmer', name: 'Shimmer', description: '柔和、亲切' },
];

export default function TTSTab() {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('alloy');
  const [speed, setSpeed] = useState(1.0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const generateSpeech = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: text, voice, speed }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '生成失败');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-4">TTS 文字转语音</h2>

      <div className="space-y-4">
        {/* Text */}
        <div>
          <label className="block text-sm font-medium mb-2">输入文字</label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="输入要转换为语音的文字..."
            className="textarea"
            rows={4}
          />
          <p className="text-xs text-muted mt-1">{text.length} / 4096 字符</p>
        </div>

        {/* Voice Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">选择声音</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {voices.map(v => (
              <button
                key={v.id}
                onClick={() => setVoice(v.id)}
                className={`p-3 rounded-lg border transition-all ${
                  voice === v.id
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card hover:border-muted'
                }`}
              >
                <div className="font-medium text-sm">{v.name}</div>
                <div className="text-xs opacity-70">{v.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Speed */}
        <div>
          <label className="block text-sm font-medium mb-2">
            语速: {speed.toFixed(1)}x
          </label>
          <input
            type="range"
            min="0.25"
            max="4.0"
            step="0.25"
            value={speed}
            onChange={e => setSpeed(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted">
            <span>0.25x</span>
            <span>1.0x</span>
            <span>4.0x</span>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateSpeech}
          disabled={loading || !text.trim()}
          className="btn-primary w-full"
        >
          {loading ? '生成中...' : '生成语音'}
        </button>

        {/* Error */}
        {error && (
          <div className="p-4 bg-danger/10 border border-danger/20 rounded-lg text-danger text-sm">
            {error}
          </div>
        )}

        {/* Audio Player */}
        <audio ref={audioRef} controls className="w-full" />
      </div>
    </div>
  );
}
