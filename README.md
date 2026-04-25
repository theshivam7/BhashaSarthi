<div align="center">

# BhashaSarthi

[![React Native](https://img.shields.io/badge/React_Native-0.81-blue?logo=react)](https://reactnative.dev)
[![Expo](https://img.shields.io/badge/Expo-54-black?logo=expo)](https://expo.dev)
[![Gemini](https://img.shields.io/badge/Powered_by-Google_Gemini-4285F4?logo=google)](https://aistudio.google.com)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![Open Source](https://img.shields.io/badge/Open_Source-Yes-brightgreen)](https://github.com/theshivam7/BhashaSarthi)

**Fast, accurate translation for 22 Indian languages — powered by Google Gemini AI.**

> Coming soon on **Android**, **iOS**, and **Desktop**

[Get Started](#getting-started) · [Features](#features) · [Contributing](#contributing)

</div>

---

## Overview

BhashaSarthi is a free, open source React Native (Expo) translation app built for everyone. It supports 22 Indian languages with voice input, text-to-speech, and a clean dark-mode interface. Available on iOS and Android. Translations are powered by Google Gemini 2.5 Flash.

Whether you are a student, developer, traveller, or building on top of this project — BhashaSarthi is free to use, fork, and contribute to.

## Features

- Translate between 22 Indian languages
- **Voice input** — speak and Gemini transcribes + translates in one step
- **Text-to-speech** — listen to any translation using device TTS
- Swap source and target languages instantly, including text
- Translation history saved on-device, up to 50 entries
- Copy or share any translation
- Search when selecting a language
- 500-character input limit with live counter
- Auto-retry on rate limit with exponential backoff
- Dark mode only — clean, minimal interface

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native 0.81 + Expo SDK 54 |
| Translation + Voice AI | Google Gemini 2.5 Flash (free tier) |
| Text-to-Speech | expo-speech (device native TTS, free) |
| Audio Recording | expo-audio |
| Navigation | React Navigation v7 |
| Storage | AsyncStorage (on-device only) |
| HTTP | Axios |

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/theshivam7/BhashaSarthi.git
cd BhashaSarthi
npm install
```

### 2. Get a free Gemini API key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **Create API key** — no credit card required

Free tier: **15 requests/minute, 1500 requests/day**

### 3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run the app

```bash
npx expo start --clear
```

- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan the QR code with [Expo Go](https://expo.dev/go) on your phone (requires Expo SDK 54)

> **Note:** Voice input and custom splash screen require a development or production build. Run `npx expo run:ios` or `npx expo run:android` to test locally, or use `eas build` for a full build.

## Supported Languages (22)

Assamese, Bengali, Bodo, Dogri, English, Gujarati, Hindi, Kannada, Konkani, Maithili, Malayalam, Manipuri, Marathi, Nepali, Odia, Punjabi, Sanskrit, Santali, Sindhi, Tamil, Telugu, Urdu

## Project Structure

```
BhashaSarthi/
├── screens/
│   ├── HomeScreen.js           # Translation UI, voice input, TTS, Gemini API
│   ├── SavedScreen.js          # Translation history
│   ├── SettingsScreen.js       # Settings, about, privacy, terms
│   └── LanguageSelectScreen.js # Language picker with search
├── components/
│   └── LanguageItem.js         # Language list item
├── utils/
│   ├── colors.js               # Dark mode design tokens
│   └── supportedLanguages.js   # 22 language code → name map
├── assets/
│   ├── fonts/                  # Roboto Regular, Medium, Bold
│   ├── icon.png                # App icon 1024×1024 RGB
│   ├── adaptive-icon.png       # Android adaptive icon
│   ├── splash-icon.png         # Splash screen 1242×2688
│   └── favicon.png             # Web favicon
├── App.js                      # Navigation + dark theme setup
├── babel.config.js             # Babel + react-native-dotenv
├── eas.json                    # EAS Build config
├── app.json                    # Expo config, permissions, privacy manifest
├── .env.example                # Environment variable template
└── package.json
```

## Environment Variables

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google AI Studio API key |

## Permissions

| Permission | Platform | Purpose |
|---|---|---|
| Microphone | iOS + Android | Voice input recording |

## Rate Limits (Free Tier)

Gemini 2.5 Flash: **15 req/min** on free tier. The app retries automatically on rate limit errors with exponential backoff.

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details. You are free to use, modify, and distribute this app for any purpose.

## Contributing

Contributions are welcome from everyone. To contribute:

1. Fork the repository
2. Create a branch: `git checkout -b feat/your-feature`
3. Commit using conventional commits: `git commit -m "feat: add your feature"`
4. Open a pull request with a clear description

Please keep changes focused and test on both iOS and Android before submitting.

---

Developed by [Shivam Sharma](https://www.linkedin.com/in/theshivam7/) — IIT Madras
