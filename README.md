# Kinetix AI — Modern Glassmorphic AI Workspace & Interactive Artifacts

[![Next.js 15](https://img.shields.io/badge/Next.js-15.1-purple.svg)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19.0-6366f1.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-8b5cf6.svg)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-a855f7.svg)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](./LICENSE)

**Kinetix** is an open-source, frontier AI workspace designed with an **Apple-inspired Glassmorphism UI** and an elegant **Royal Purple** palette. It combines local, offline intelligence with multi-provider cloud AI, featuring live interactive Artifacts, extended thinking accordions, and persistent project knowledge bases.

---

## ✨ Features

- 🟣 **Apple Glassmorphic Design System**: Ambient radial mesh gradients, frosted glass panels (`backdrop-blur-2xl`), hairline borders, and a vibrant Purple aesthetic. Zero orange.
- 🎨 **Interactive Artifacts Canvas**: Real-time split-screen execution for HTML, CSS, JavaScript, SVG vector graphics, and React components with both live preview and syntax-highlighted code tabs.
- 🧠 **Hybrid Reasoning & Thinking Accordion**: Step-by-step reasoning transparency with collapsible thinking logs and duration timers.
- ⚡ **Zero-Config Offline Intelligence**: Runs out-of-the-box using local **Ollama** (`qwen3.5:latest`) with zero API keys required, zero latency limits, and 100% data privacy.
- 🔑 **Multi-Provider Cloud AI**: 1-click support to connect frontier API keys whenever needed (Anthropic, Groq, OpenAI, or Google Gemini).
- 🔐 **Authentication & Session**: Dedicated Apple-style Glassmorphic `/login` and `/logout` flows with persistent session management.
- 📁 **Project Knowledge Bases**: Token budgeting, document ingestion, and custom system directives.

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/your-username/kinetix-ai.git
cd kinetix-ai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Key Routes

| Route | Purpose |
| :--- | :--- |
| `http://localhost:3000/` | Main Glassmorphic AI Workspace & Artifacts Canvas |
| `http://localhost:3000/login` | Apple Glass Authentication (Sign In, Sign Up, Demo Login) |
| `http://localhost:3000/projects` | Project Knowledge Base & Document Token Metering |
| `http://localhost:3000/settings` | Appearance Theme, Account, and Rolling Usage Settings |
| `http://localhost:3000/launch` | Product Showcase & Landing Page |

---

## 🛠️ Stack

- **Framework**: Next.js 15 (App Router, Server-Sent Events SSE streaming)
- **UI Library**: React 19, Lucide React icons
- **Styling**: Tailwind CSS, CSS Custom Properties, Apple Glassmorphism Backdrop Blur
- **Inference Engines**: Local Ollama (Qwen), Anthropic Messages API, Groq OpenAI-compatible API
- **License**: MIT

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/kinetix-ai/issues).

---

## 📄 License

Distributed under the MIT License. See [LICENSE](./LICENSE) for details.
