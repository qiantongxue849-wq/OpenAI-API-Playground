'use client';

import { useState } from 'react';

const schemas = [
  { id: 'person', name: '人物信息', icon: '👤', placeholder: '例如：张三，28岁，软件工程师，擅长Python、JavaScript和机器学习' },
  { id: 'product', name: '产品信息', icon: '📦', placeholder: '例如：iPhone 15 Pro，售价7999元，钛金属机身，A17 Pro芯片，48MP摄像头' },
  { id: 'sentiment', name: '情感分析', icon: '😊', placeholder: '例如：这家餐厅的服务非常好，菜品也很美味，就是价格有点贵' },
];

export default function StructuredOutputTab() {
  const [text, setText] = useState('');
  const [schema, setSchema] = useState('person');
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedSchema = schemas.find(s => s.id === schema);

  const extractInfo = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/structured-output', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, schema }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResult(data.result);
      }
    } catch {
      setError('提取失败，请检查 API Key 配置');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-4">Structured Output 结构化输出</h2>
      <p className="text-sm text-muted mb-4">
        演示从非结构化文本中提取结构化数据的能力
      </p>

      <div className="space-y-4">
        {/* Schema Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">选择提取类型</label>
          <div className="grid grid-cols-3 gap-2">
            {schemas.map(s => (
              <button
                key={s.id}
                onClick={() => { setSchema(s.id); setResult(null); }}
                className={`p-3 rounded-lg border transition-all ${
                  schema === s.id
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card hover:border-muted'
                }`}
              >
                <span className="text-2xl">{s.icon}</span>
                <div className="text-sm font-medium mt-1">{s.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div>
          <label className="block text-sm font-medium mb-2">输入文本</label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={selectedSchema?.placeholder}
            className="textarea"
            rows={3}
          />
        </div>

        {/* Extract Button */}
        <button
          onClick={extractInfo}
          disabled={loading || !text.trim()}
          className="btn-primary w-full"
        >
          {loading ? '提取中...' : '提取信息'}
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
            <label className="block text-sm font-medium mb-2">提取结果</label>
            <div className="p-4 bg-card-hover rounded-xl border border-border">
              <pre className="text-sm overflow-auto whitespace-pre-wrap">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(JSON.stringify(result, null, 2))}
              className="btn-secondary text-sm mt-2"
            >
              复制 JSON
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
