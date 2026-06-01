'use client';

import { useState } from 'react';

const examples = [
  { label: '查天气', message: '北京今天天气怎么样？' },
  { label: '算数学', message: '帮我计算 (15 * 23) + 456 - 789' },
  { label: '混合查询', message: '上海今天多少度？另外帮我算一下 100 的阶乘是多少' },
];

export default function FunctionCallingTab() {
  const [message, setMessage] = useState('');
  const [result, setResult] = useState<{
    functionCalled: string | null;
    functionArgs?: Record<string, unknown>;
    functionResult?: Record<string, unknown>;
    response: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callFunction = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/function-calling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch {
      setError('调用失败，请检查 API Key 配置');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-4">Function Calling 函数调用</h2>
      <p className="text-sm text-muted mb-4">
        演示 OpenAI 的 Function Calling 功能，AI 可以自动判断何时调用外部函数
      </p>

      <div className="space-y-4">
        {/* Examples */}
        <div>
          <label className="block text-sm font-medium mb-2">快速示例</label>
          <div className="flex gap-2 flex-wrap">
            {examples.map((ex, i) => (
              <button
                key={i}
                onClick={() => setMessage(ex.message)}
                className="btn-secondary text-sm"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div>
          <label className="block text-sm font-medium mb-2">输入消息</label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="试试问天气或数学计算..."
            className="textarea"
            rows={2}
          />
        </div>

        {/* Call Button */}
        <button
          onClick={callFunction}
          disabled={loading || !message.trim()}
          className="btn-primary w-full"
        >
          {loading ? '处理中...' : '发送请求'}
        </button>

        {/* Error */}
        {error && (
          <div className="p-4 bg-danger/10 border border-danger/20 rounded-lg text-danger text-sm">
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="animate-fade-in space-y-4">
            {/* Function Call Info */}
            {result.functionCalled && (
              <div className="p-4 bg-accent/10 border border-accent/20 rounded-xl">
                <h3 className="font-medium text-accent mb-2">调用了函数: {result.functionCalled}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted mb-1">参数:</p>
                    <pre className="p-2 bg-card rounded text-xs overflow-auto">
                      {JSON.stringify(result.functionArgs, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <p className="text-muted mb-1">返回值:</p>
                    <pre className="p-2 bg-card rounded text-xs overflow-auto">
                      {JSON.stringify(result.functionResult, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* AI Response */}
            <div>
              <label className="block text-sm font-medium mb-2">AI 回复</label>
              <div className="p-4 bg-card-hover rounded-xl border border-border whitespace-pre-wrap">
                {result.response}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
