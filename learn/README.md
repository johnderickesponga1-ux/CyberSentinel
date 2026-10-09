# 🛡️ CyberSentinel

Learn cybersecurity with lessons, quizzes, flashcards, a hands-on terminal lab, a pixel adventure map and a **local AI tutor** (Ollama / LM Studio). Installable as an app on phones, tablets and computers. Works offline.

## Quick start (any computer)
```bash
git clone https://github.com/YOUR-NAME/cybersentinel.git
cd cybersentinel
node server.js          # Node 18+, no npm install needed
```
Open `http://localhost:8080`. The terminal prints a **Network** address — open it on your phone or tablet (same Wi-Fi) and the AI works there too.

## Install as an app
Open the site in Chrome / Edge / Safari → **Install app** / **Add to Home Screen**.
(Installing needs HTTPS or `localhost`, so use the GitHub Pages link or a tunnel; plain `http://192.168…` still works as a normal web page.)

## Local AI on every device
1. Install [Ollama](https://ollama.com) and run `ollama pull llama3.2:3b` once.
2. Run `node server.js` on that computer. It serves the app **and** proxies the AI at `/ollama`, so there are no CORS or mixed-content problems.
3. Other devices open the printed Network address — the AI is detected automatically.

| Where you open the app | What to do |
|---|---|
| Same computer | Nothing, it is detected |
| Phone/tablet on same Wi-Fi | Open the Network address from `node server.js` |
| GitHub Pages (https) or away from home | Expose the server over HTTPS (`cloudflared tunnel --url http://localhost:8080` or Tailscale Funnel), then paste `https://YOUR-ADDRESS/ollama` in **Home → AI Assistant Status → AI server address** and press SAVE |

Optional protection when exposed: `ACCESS_KEY=mysecret node server.js`, then save the address as `https://YOUR-ADDRESS/ollama?key=mysecret`. Without an AI server the built-in offline tutor still answers.

## Publish on GitHub Pages
1. Create a repo and push these files to `main`.
2. **Settings → Pages → Source: GitHub Actions**.
3. The included workflow (`.github/workflows/pages.yml`) deploys automatically. Your site: `https://YOUR-NAME.github.io/REPO/`.

Accounts on GitHub Pages are local-demo accounts (see `AUTH_SETUP.md`). Real accounts need a backend.

## Demo video (Remotion, 55 s)
```bash
cd demo-video
npm install
npm run studio     # preview
npm run render     # -> out/cybersentinel-demo.mp4
```

## Files
`index.html` app · `sw.js` offline cache · `manifest.webmanifest` + `icons/` install info · `server.js` local server + AI proxy · `demo-video/` Remotion project.

Use the lab only on systems you own or have written permission to test.
