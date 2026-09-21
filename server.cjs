'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.png':'image/png','.ico':'image/x-icon','.woff2':'font/woff2','.ttf':'font/ttf','.mp4':'video/mp4'};
const server = http.createServer((req,res) => {
  if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405,{'Allow':'GET, HEAD'}); return res.end('Method not allowed'); }
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400); return res.end('Invalid URL'); }
  let file = path.resolve(root,'.' + pathname);
  if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403); return res.end('Forbidden'); }
  try {
    if (fs.statSync(file).isDirectory()) {
      if (!pathname.endsWith('/')) { res.writeHead(308,{Location:pathname+'/'}); return res.end(); }
      file = path.join(file,'index.html');
    }
    const stat = fs.statSync(file);
    if (!stat.isFile()) throw new Error('Not a file');
    let start = 0, end = stat.size-1, status = 200;
    const headers = {'Content-Type':types[path.extname(file)] || 'application/octet-stream','Accept-Ranges':'bytes','X-Content-Type-Options':'nosniff','Cache-Control':'no-cache'};
    if (req.headers.range) {
      const m = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
      if (!m || (!m[1] && !m[2])) { res.writeHead(416,{'Content-Range':`bytes */${stat.size}`}); return res.end(); }
      if (m[1]) { start=Number(m[1]); end=m[2]?Math.min(Number(m[2]),end):end; }
      else { start=Math.max(0,stat.size-Number(m[2])); }
      if (start>end || start>=stat.size) { res.writeHead(416,{'Content-Range':`bytes */${stat.size}`}); return res.end(); }
      status=206; headers['Content-Range']=`bytes ${start}-${end}/${stat.size}`;
    }
    headers['Content-Length']=Math.max(0,end-start+1);
    res.writeHead(status,headers);
    if (req.method==='HEAD' || !stat.size) return res.end();
    fs.createReadStream(file,{start,end}).on('error',()=>res.destroy()).pipe(res);
  } catch { res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'}); res.end('Page or asset not found'); }
});
if (require.main === module) server.listen(Number(process.env.PORT)||8080,'127.0.0.1',()=>console.log(`Open http://localhost:${server.address().port}. Press Ctrl+C to stop.`));
module.exports = server;