/* Temporary local static server for Supabase Auth callback testing only.
 * Run: node scripts/local-auth-server.mjs
 * Stop: Ctrl+C in the server terminal, or terminate the recorded local process.
 */
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const host = "127.0.0.1";
const port = 3000;
const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".pdf": "application/pdf"
};

createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url || "/", `http://${host}:${port}`).pathname);
  const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const filePath = resolve(root, normalize(relativePath));
  if (!filePath.startsWith(`${root}${sep}`) && filePath !== root) {
    response.writeHead(403).end("Forbidden");
    return;
  }
  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    response.writeHead(404).end("Not found");
    return;
  }
  response.writeHead(200, {
    "Content-Type": types[extname(filePath).toLowerCase()] || "application/octet-stream",
    "Cache-Control": "no-store"
  });
  createReadStream(filePath).pipe(response);
}).listen(port, host, () => {
  console.log(`Samsung Event Dashboard local auth test server: http://localhost:${port}/`);
});
