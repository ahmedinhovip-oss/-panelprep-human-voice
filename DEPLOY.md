
## Natural interviewer voices

For the human-like panel voices, add `ELEVENLABS_API_KEY` in Vercel and redeploy.
This build uses Eleven v4 through ElevenLabs Text-to-Dialogue streaming. To use specific voices,
set `ELEVENLABS_HR_VOICE_ID`, `ELEVENLABS_GM_VOICE_ID`, and `ELEVENLABS_SPECIALIST_VOICE_ID`.
After deployment open `/#/check`; each Play result should say **Spoken by ElevenLabs (eleven_v4)**.
If it says the device's built-in voice, the cloud voice is not active.

# Put PanelPrep online with Vercel

You get an `https://…vercel.app` address that works on iPhone Safari, with real
microphone recording and ElevenLabs voices. Takes about 15 minutes.

## What you need

| Account | Why | Where |
| --- | --- | --- |
| GitHub | Vercel deploys from a GitHub repository | github.com |
| Vercel (free Hobby plan) | Hosts the app over HTTPS | vercel.com |
| Anthropic API key | Prepares the interview, runs the panel, scores the answers | console.anthropic.com |
| ElevenLabs API key | Interviewer voices (Eleven v4 Turbo) and turning your recorded answers into text (Scribe) | elevenlabs.io > Profile > API keys |

The keys go into Vercel's settings only. They are never in the code, `index.html` or the browser.

## Steps

1. **Upload the project to GitHub.** Create a new repository (for example `panelprep`), unzip `panelprep.zip` and upload the contents of the `panelprep` folder (not the zip itself, and not `node_modules`).
2. **Import it in Vercel.** In Vercel choose **Add New > Project**, pick the repository and keep the defaults (Framework preset: Other). `vercel.json` and the root `server.js` provide the Vercel entry point; `public/` contains the web app.
3. **Add the environment variables** (in the import screen, or later under **Settings > Environment Variables**):

   | Name | Value |
   | --- | --- |
   | `ANTHROPIC_API_KEY` | your Anthropic key |
   | `ELEVENLABS_API_KEY` | your ElevenLabs key |
   | `TTS_PROVIDER` | `elevenlabs` |
   | `ELEVENLABS_HR_VOICE_ID` | Voice ID for the HR Manager (warm, professional woman) |
   | `ELEVENLABS_GM_VOICE_ID` | Voice ID for the General Manager (senior man) |
   | `ELEVENLABS_SPECIALIST_VOICE_ID` | Voice ID for the Specialist |
   | `ELEVENLABS_SPECIALIST_GENDER` | `female` or `male`, to match the Specialist voice |
   | `APP_ACCESS_CODE` | a code you choose, so strangers can't use your credit |

   To get a Voice ID: in ElevenLabs open **Voices** (or the Voice Library), choose a voice, and copy its Voice ID. Left empty, the app uses Matilda, Brian and Alice.
4. **Deploy.** Vercel builds and gives you the address. After changing a variable, use **Deployments > Redeploy**.
5. **Check it on your iPhone.** Open the address in Safari, tap **Check voice and microphone** on the home screen, allow the microphone, and make sure every line shows a tick:
   - HTTPS, serverTts, serverStt, standalone (noMic false, embedded false)
   - each interviewer says "Spoken by ElevenLabs"
   - Speak > Stop shows the words you said
6. Optional: in Safari tap **Share > Add to Home Screen** to use it like an app.

## Limits on the free Vercel plan

- Each request can run up to 5 minutes and send up to 4.5 MB. Recorded answers stop at three minutes (about 1.5 MB), and uploaded CVs or job descriptions must be under 4 MB (or paste the text).
- The server runs in Frankfurt (`fra1` in `vercel.json`), the closest Vercel region to the Gulf.

## Other hosts

The same project also runs anywhere Node 22 runs: `npm install && npm start` (port 3000), the `Dockerfile`, or Render with `render.yaml`. Microphones need HTTPS, so test phones against an https:// address.
