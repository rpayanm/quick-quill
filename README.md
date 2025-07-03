# Quick Quill

[![Mozilla Add-on Version](https://img.shields.io/amo/v/quick-quill?style=for-the-badge&logo=firefox)](https://addons.mozilla.org/en-US/firefox/addon/quick-quill/)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/ijaogpcnbfkimbcapjalpagcmkcbcdfm?style=for-the-badge&logo=chrome)](https://chrome.google.com/webstore/detail/quick-quill/ijaogpcnbfkimbcapjalpagcmkcbcdfm)


A browser extension that allows you to execute AI prompts on selected text directly in your browser.

## Overview

Quick Quill is a powerful browser extension that enhances your browsing experience by providing instant AI-powered text transformations. Simply select any text on a webpage, right-click, and choose from your custom prompts to transform the text using AI models from your preferred AI provider.

## Features

- **Text Selection Processing**: Works with any text you select on any webpage
- **Custom Prompts**: Create and manage your own collection of AI prompts
- **Multiple AI Providers**: Supports popular AI models
- **Context Menu Integration**: Easy access through the browser's right-click menu
- **Instant Results**: View AI-generated responses in a convenient popup
- **Copy to Clipboard**: One-click copying of AI responses

## Supported AI Models

### OpenAI
- GPT-4.1 nano
- GPT-4o mini
- GPT-4.1 mini
- o4-mini
- o3-mini

### Google
- Gemini 2.5 Flash
- Gemini 2.5 Pro

## Getting Started

1. Install the extension from your browser's extension store
2. Open the extension options page
3. Add your API keys.
4. Create custom prompts and associate them with your preferred AI model
5. Select text on any webpage, right-click, and choose your prompt from the context menu

## Development

Quick Quill is built with:
- [WXT](https://wxt.dev/) - Modern web extension framework
- React 19
- TypeScript
- Tailwind CSS
- AI SDK for OpenAI and Google AI integrations

### Prerequisites

- Node.js (version specified in `.nvmrc`)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/quick-quill.git
cd quick-quill

# Install dependencies
npm install
```

### Development Commands

```bash
# Start development server for Chrome
npm run dev

# Start development server for Firefox
npm run dev:firefox

# Build for production (Chrome)
npm run build

# Build for production (Firefox)
npm run build:firefox

# Create distribution zip (Chrome)
npm run zip

# Create distribution zip (Firefox)
npm run zip:firefox

# Type checking
npm run compile
```

## License

[MIT License](LICENSE)

## Acknowledgements

- Built with [WXT](https://wxt.dev/)
- Uses [AI SDK](https://sdk.vercel.ai/docs) for AI model integration
