#!/usr/bin/env node
/* CyberSentinel local server (zero dependencies, Node 18+).
   - Serves the app to every device on your network.
   - Proxies /ollama/* -> Ollama (11434) and /lmstudio/* -> LM Studio (1234),
     so phones and tablets get the AI with no CORS or "mixed content" problems.
   Usage:  node server.js            (port 8080)
           PORT=3000 node server.js
           OLLAMA_URL=http://127.0.0.1:11434 node server.js
           ACCESS_KEY=mysecret node server.js   (AI requires ?key=… / header x-access-key) */
const http = require('http'), fs = require('fs'), path = require('path'), os = require('os');
const PORT = +process.env.PORT || 8080, HOST = process.env.HOST || '0.0.0.0';
const TARGETS = { '/ollama': process.env.OLLAMA_URL || 'http://127.0.0.1:11434', '/lmstudio': process.env.LMSTUDIO_URL || 'http://127.0.0.1:1234' };
const KEY = process.env.ACCESS_KEY || '';
const ROOT = __dirname;
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.md': 'text/markdown; charset=utf-8', '.txt': 'text/plain' };
const PUBLIC = new Set(['index.html', 'sw.js', 'manifest.webmanifest', 'AUTH_SETUP.md']);

function proxy(req, res, prefix) {
  if (KEY && req.headers['x-access-key'] !== KEY && new URL(req.url, 'http://x').searchParams.get('key') !== KEY) { res.writeHead(401); return res.end('AI access key required'); }
  const t = new URL(TARGETS[prefix]), sub = req.url.slice(prefix.length) || '/';
  const headers = { ...req.headers, host: t.host }; delete headers.origin; delete headers.referer;
  const up = http.request({ hostname: t.hostname, port: t.port, path: sub, method: req.method, headers }, r => { res.writeHead(r.statusCode, r.headers); r.pipe(res); });
  up.on('error', () => { res.writeHead(502, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: 'AI backend not running at ' + TARGETS[prefix] })); });
  req.pipe(up);
}
function serve(req, res) {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p === '/') p = '/index.html';
  const rel = path.normalize(p).replace(/^[/\\]+/, '');
  const ok = PUBLIC.has(rel) || rel.startsWith('icons' + path.sep);
  const f = path.join(ROOT, rel);
  if (!ok || !f.startsWith(ROOT)) { res.writeHead(404); return res.end('Not found'); }
  fs.readFile(f, (e, d) => {
    if (e) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-cache' }); res.end(d);
  });
}
http.createServer((req, res) => {
  const prefix = Object.keys(TARGETS).find(k => req.url === k || req.url.startsWith(k + '/') || req.url.startsWith(k + '?'));
  prefix ? proxy(req, res, prefix) : serve(req, res);
}).listen(PORT, HOST, () => {
  console.log('\n  CyberSentinel is running\n');
  console.log('  This computer :  http://localhost:' + PORT);
  for (const l of Object.values(os.networkInterfaces()).flat()) if (l && l.family === 'IPv4' && !l.internal) console.log('  Network       :  http://' + l.address + ':' + PORT + '   <- open this on your phone/tablet');
  console.log('\n  AI proxy      :  /ollama -> ' + TARGETS['/ollama'] + (KEY ? '  (access key required)' : ''));
  console.log('  Press Ctrl+C to stop.\n');
});
