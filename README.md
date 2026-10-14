# PanelPrep

Practise a job interview out loud with an AI panel, then get every answer scored.

- **Three interviewers**: an HR Manager who opens and closes, a General Manager who asks high-level questions about the job, and a Specialist who goes deep into your field. Each has a name, a style and their own voice.
- **Full panel or one interviewer.** With a single interviewer you can keep or drop HR's opening and closing.
- **Difficulty**: basic, medium or difficult. **Tricky questions** on or off.
- **30 to 45 minutes**, split between the interviewers and paced by the clock. The panel follows up on vague answers and hands over when an interviewer's time is up.
- **Your job description and CV** can be uploaded (PDF, Word, text, or a photo) or pasted.
- **After the interview**: a score out of 100, scores by interviewer and skill, and for every question your answer, how it could be better, a stronger version and the key elements. Download it all as a **PDF**.
- **Study mind map** of the topics to focus on for that job, ranked by priority.
- **Installable app (PWA)** for phones and computers. Interviews are saved on the device.

## Run it

You need [Node.js 20 or newer](https://nodejs.org).

```bash
npm install
cp .env.example .env      # then put your Anthropic API key in .env
npm start
```

Open http://localhost:3000.

Without an API key the app starts in **demo mode**: the panel follows a script and the scores come from simple rules. Use it to click through the whole flow, then add `ANTHROPIC_API_KEY` for real interviews.

`npm run smoke` runs a complete interview against the server code without a browser and writes `smoke-report.pdf`.

## Settings (`.env`)

| Variable | What it does |
| --- | --- |
| `ANTHROPIC_API_KEY` | Required for real interviews. Claude plans the interview, voices the panel and scores the answers. |
| `ELEVENLABS_API_KEY` | Interviewer voices (ElevenLabs Eleven v4 Turbo) and transcription of recorded answers (ElevenLabs Scribe). Server only, never sent to the browser. |
| `ELEVENLABS_HR_VOICE_ID`, `ELEVENLABS_GM_VOICE_ID`, `ELEVENLABS_SPECIALIST_VOICE_ID` | The fixed voice of each interviewer. Copy a Voice ID from ElevenLabs. |
| `OPENAI_API_KEY` | Optional alternative for voices and transcription (`TTS_PROVIDER=openai`, `STT_PROVIDER=openai`). |
| `APP_ACCESS_CODE` | Optional. Testers must enter this code, so strangers can't spend your credit. |
| `TRUST_PROXY` | Set to `1` behind a proxy or load balancer so rate limits see real visitors. |
| `PORT`, `APP_NAME` | Port and the name shown in the app. |
| `MODEL_*` | Override the Claude models. The live panel uses the fastest model so replies come quickly. |

## Voices and voice answers

**Interviewer voices.** With `ELEVENLABS_API_KEY` set, `/api/config` reports `serverTts: true` and the panel speaks with ElevenLabs (`eleven_v4_turbo`). The browser sends each line's text and the speaker's role to `/api/speak`; the server adds the role's fixed voice ID and delivery settings (`server/speech.js`, `ELEVENLABS_DELIVERY`) and streams the audio back. A whole interviewer turn is generated as one utterance, all lines of a turn are fetched in parallel as soon as the text arrives, and every line is cached, so Repeat is instant. The device's built-in voice is only an emergency fallback for a line whose server voice failed twice; after three failures in a row, or a wrong key or voice ID, the rest of the interview uses it and a message says so.

**Answers.** When the server has speech-to-text (`serverStt: true`), the candidate taps **Speak** (the browser asks for the microphone the first time and recording starts at once), taps **Stop**, the recording is sent to `/api/transcribe`, and the text appears in the answer box to check and edit before **Send**. This works in Safari on iPhone, iPad and Mac (including Add to Home Screen), Chrome and Edge. Without server speech-to-text, browsers with speech recognition show live captions instead, and others type.

**Inside the Claude preview** (`artifact/` build) the microphone is blocked, so answers are typed there and the Speak button says so.

**Check the voices.** `npm run voices` generates one line per interviewer into `voice-test/` and transcribes one back. In the app, "Meet your panel" shows the voice engine and has a "Hear …’s voice" button for each interviewer. In the browser console, `window.panelprepVoice` shows the engine that spoke last, and each `/api/speak` response carries `X-TTS-Provider: elevenlabs`.

## Put it online

Microphones and app installation need **HTTPS**, so deploy it before testing on a phone.

**Quickest: Vercel.** Follow `DEPLOY.md` (GitHub + Vercel, about 15 minutes); the root `server.js` and `vercel.json` are ready.

**Render.** Put this folder in a GitHub repository, then in Render choose **New > Blueprint** and pick the repository. `render.yaml` sets everything up; Render asks for `ANTHROPIC_API_KEY`, `ELEVENLABS_API_KEY`, the three voice IDs and `APP_ACCESS_CODE` (set a code so strangers can't use your credit). You get an `https://…onrender.com` address that works on any phone. On the free plan the app sleeps when unused and takes about a minute to wake.

Any other Node host works too (Railway, Fly.io, a VPS with Nginx and Let's Encrypt). There is a `Dockerfile`:

```bash
docker build -t panelprep .
docker run -p 3000:3000 --env-file .env panelprep
```

Set `TRUST_PROXY=1` on hosts that sit behind a proxy. When you change the front end, bump `VERSION` in `public/sw.js` so installed apps pick up the new files.

## How it works

1. **Setup** (`public/js/app.js`): job, description and CV (uploads are converted to text by `server/extract.js`; scanned PDFs and photos are read by Claude), then panel mode, difficulty, tricky questions, length and answer mode.
2. **Analysis** (`POST /api/plan`): Claude reads both documents, finds strengths and gaps, creates the three interviewers and writes the questions for each stage, with key elements and follow-ups. The time split lives in `server/engine/stages.js`.
3. **Live interview** (`POST /api/turn`, `public/js/interview.js`): the code decides what is allowed (follow-up limits, each interviewer's time budget, handovers, closing) and Claude chooses among those actions and writes what the interviewer says. Speech runs on the device; only text goes to the server. The session is saved after every turn and resumes after a reload.
4. **Debrief** (`POST /api/evaluate`): each interviewer's questions are scored in parallel, then a summary and the mind map are written. The overall score is the weighted average of the question scores.
5. **PDF** (`POST /api/report`, `server/report/pdf.js`): the full report, including the mind map.

The prompts are in `server/ai/prompts.js`. The colours and fonts are tokens at the top of `public/css/app.css`.

## Privacy

The server stores nothing. Interviews, transcripts and reports live in the browser's storage on the device and can be deleted from History. The job description, CV and answers are sent to Anthropic (and to OpenAI if you enable server speech) to run the interview.

## Open source

PanelPrep is released under the MIT License. Contributions are welcome; see `CONTRIBUTING.md`.

The repository intentionally contains no API keys or `.env` file. Copy `.env.example` to `.env` locally and keep credentials out of Git.
