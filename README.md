# AI Bridge Backend

A Node.js backend application built with Express and TypeScript that integrates AI model functionalities such as Google Cloud Text-to-Speech, providing a seamless API interface for frontend applications.

## Features

- Text-to-speech conversion using Google Cloud TTS
- Multiple voice options and languages support
- Automatic file cleanup
- TypeScript support
- RESTful API endpoints
- Error handling middleware
- Static file serving for audio files

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Cloud account with Text-to-Speech API enabled
- Google Cloud service account credentials

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd ai-bridge
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/credentials.json
```

4. Build the project:

```bash
npm run build
```

## Development

To start the development server with hot-reload:

```bash
npm run dev
```

## Production

To start the production server:

```bash
npm run build
npm start
```

## API Documentation

### List Available Voices

Get a list of available voices, optionally filtered by language code.

```http
GET /api/tts/voices?languageCode=en-US
```

Response:

```json
{
  "status": "success",
  "data": {
    "voices": [
      {
        "name": "en-US-Wavenet-D",
        "languageCodes": ["en-US"],
        "gender": "MALE",
        "naturalSampleRateHertz": 24000
      }
      // ... more voices
    ]
  }
}
```

### Generate Speech

Convert text to speech using a specific voice or language settings.

```http
POST /api/tts/synthesize
```

Request body:

```json
{
  "text": "Hello, this is a test",
  "voiceName": "en-US-Wavenet-D"
}
```

Or using language settings:

```json
{
  "text": "Hello, this is a test",
  "languageCode": "en-US",
  "ssmlGender": "MALE",
  "audioEncoding": "MP3"
}
```

Response:

```json
{
  "status": "success",
  "data": {
    "audioPath": "/audio/speech-1234567890.mp3"
  }
}
```

## Project Structure

```
src/
├── index.ts              # Application entry point
├── routes/              # Route definitions
│   └── tts.routes.ts
├── controllers/         # Route controllers
│   └── tts.controller.ts
├── middleware/          # Custom middleware
│   └── errorHandler.ts
├── services/           # Business logic
│   └── googleTTS.service.ts
├── models/             # Data models
│   └── tts.model.ts
└── utils/              # Utility functions
    └── cleanup.ts
```

## Available Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build the project
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## File Management

- Audio files are stored in the `output` directory
- Files are automatically cleaned up after 24 hours
- Files are served statically from the `/audio` endpoint
- Each file has a unique name based on timestamp

## Error Handling

The API uses a custom error handling middleware that returns errors in this format:

```json
{
  "status": "error",
  "message": "Error message here"
}
```

Common error codes:

- 400: Bad Request (e.g., missing required text)
- 500: Internal Server Error

## Security

- Uses Helmet for security headers
- CORS enabled
- Environment variables for sensitive data
- No sensitive data in response paths

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
