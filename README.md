# 🚀 OpenAI API Playground

一个精美的 OpenAI API 全能演示平台，展示 OpenAI 全部 API 能力。

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-blue)
![OpenAI](https://img.shields.io/badge/OpenAI-API-green)

## ✨ 功能特性

### 💬 GPT-4o 多轮对话
- 流式输出（Streaming）
- 多轮对话上下文
- Markdown 渲染支持
- 实时打字效果

### 🎨 DALL-E 3 图像生成
- 文本生成图像
- 多尺寸支持（正方形、竖版、横版）
- 标准/高清质量选择
- 一键下载生成图片

### 👁️ GPT-4 Vision 图像分析
- 上传图片进行智能分析
- 自定义分析提示词
- 支持多种图片格式
- 详细的图像描述

### 🔊 TTS 文字转语音
- 6种声音可选（Alloy、Echo、Fable、Onyx、Nova、Shimmer）
- 语速调节（0.25x - 4.0x）
- 实时播放预览
- 高质量音频输出

### 🎤 Whisper 语音转文字
- 上传音频文件转录
- 实时麦克风录音
- 支持多种音频格式
- 一键复制转录结果

### 🔧 Function Calling 函数调用
- 天气查询演示
- 数学计算演示
- 自动函数选择
- 详细的调用过程展示

### 📊 Structured Output 结构化输出
- 人物信息提取
- 产品信息提取
- 情感分析
- JSON 格式输出

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/qiantongxue849-wq/OpenAI-API-Playground.git
cd OpenAI-API-Playground
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制 `.env.example` 为 `.env.local`，并填入你的 OpenAI API Key：

```bash
cp .env.example .env.local
```

编辑 `.env.local`：
```
OPENAI_API_KEY=sk-your-api-key-here
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看效果。

## 🛠️ 技术栈

- **前端框架**: Next.js 15 (App Router)
- **UI 框架**: React 18
- **类型系统**: TypeScript
- **样式方案**: TailwindCSS 4
- **AI SDK**: OpenAI Node.js SDK
- **动画**: CSS Animations

## 📁 项目结构

```
OpenAI-API-Playground/
├── src/
│   ├── app/
│   │   ├── api/                    # API 路由
│   │   │   ├── chat/              # GPT-4o 对话
│   │   │   ├── generate-image/    # DALL-E 3 图像生成
│   │   │   ├── vision/            # Vision 图像分析
│   │   │   ├── tts/               # TTS 文字转语音
│   │   │   ├── transcribe/        # Whisper 语音转文字
│   │   │   ├── function-calling/  # Function Calling
│   │   │   └── structured-output/ # Structured Output
│   │   ├── globals.css            # 全局样式
│   │   ├── layout.tsx             # 根布局
│   │   └── page.tsx               # 主页面
│   ├── components/                # React 组件
│   │   ├── ChatTab.tsx            # 对话组件
│   │   ├── ImageTab.tsx           # 图像生成组件
│   │   ├── VisionTab.tsx          # 图像分析组件
│   │   ├── TTSTab.tsx             # TTS 组件
│   │   ├── WhisperTab.tsx         # Whisper 组件
│   │   ├── FunctionCallingTab.tsx # Function Calling 组件
│   │   └── StructuredOutputTab.tsx# Structured Output 组件
│   └── lib/
│       └── openai.ts              # OpenAI 客户端
├── .env.example                   # 环境变量示例
├── package.json
├── tsconfig.json
└── README.md
```

## 🎨 设计特点

- **暗色主题**: 护眼的深色界面
- **渐变效果**: 精美的渐变色彩搭配
- **动画过渡**: 流畅的页面切换动画
- **响应式设计**: 完美适配各种屏幕尺寸
- **毛玻璃效果**: 现代感十足的 UI 元素

## 📝 API 说明

### Chat API
- **端点**: `POST /api/chat`
- **功能**: 流式对话输出
- **参数**: `messages` - 对话历史数组

### Image Generation API
- **端点**: `POST /api/generate-image`
- **功能**: DALL-E 3 图像生成
- **参数**: `prompt`, `size`, `quality`

### Vision API
- **端点**: `POST /api/vision`
- **功能**: 图像内容分析
- **参数**: `image` (base64), `prompt`

### TTS API
- **端点**: `POST /api/tts`
- **功能**: 文字转语音
- **参数**: `input`, `voice`, `speed`

### Transcription API
- **端点**: `POST /api/transcribe`
- **功能**: 语音转文字
- **参数**: `file` (音频文件)

### Function Calling API
- **端点**: `POST /api/function-calling`
- **功能**: 函数调用演示
- **参数**: `message`

### Structured Output API
- **端点**: `POST /api/structured-output`
- **功能**: 结构化信息提取
- **参数**: `text`, `schema`

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

- [OpenAI](https://openai.com) - 提供强大的 AI API
- [Next.js](https://nextjs.org) - 优秀的 React 框架
- [TailwindCSS](https://tailwindcss.com) - 实用的 CSS 框架

---

⭐ 如果这个项目对你有帮助，请给个 Star 支持一下！
