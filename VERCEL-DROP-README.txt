PanelPrep - Vercel Drop build (fixed for Vercel 2026)

What was changed
- Added root server.js so Vercel auto-detects the Express application.
- Removed the legacy api/index.js wrapper.
- Removed the /api rewrite that can conflict with current Express auto-detection.
- Kept public/ for Vercel CDN static assets.
- Kept Node 22.x (required for new deployments now that Node 20 is deprecated).

Quick deploy
1. Upload THIS ZIP to https://vercel.com/drop as a NEW project.
2. First test it without any API keys. The home page and /api/health should work in demo mode.
3. In Vercel > Project > Settings > Environment Variables add:
   ANTHROPIC_API_KEY       (for real interview AI)
   ELEVENLABS_API_KEY      (for natural voices + speech-to-text)
   TTS_PROVIDER=elevenlabs
   Optional: APP_ACCESS_CODE
   Optional: custom ELEVENLABS_*_VOICE_ID values
4. Redeploy after adding/changing environment variables.
5. Open on iPhone Safari over the https://...vercel.app address.
6. Allow microphone access when asked.

Expected checks
- /api/health returns {"ok":true}
- /api/config shows embedded:false and noMic:false
- serverTts:true and serverStt:true only after ELEVENLABS_API_KEY is configured
- Speak starts recording on iPhone Safari
- Panel voices use ElevenLabs when serverTts:true

Do not put API key values inside any frontend file.
