import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const projectDirectory = fileURLToPath(new URL(".", import.meta.url));
const contentTypes = {
  ".css": "text/css",
  ".html": "text/html",
  ".js": "text/javascript",
  ".png": "image/png"
};

const server = createServer((request, response) => {
  const requestPath = request.url === "/" ? "index.html" : request.url.split("?")[0];
  const filePath = normalize(join(projectDirectory, requestPath));

  if (!filePath.startsWith(projectDirectory) || !existsSync(filePath) || statSync(filePath).isDirectory()) {
    response.writeHead(404, { "Content-Type": "text/plain" });
    response.end("Not found");
    return;
  }

  response.writeHead(200, { "Content-Type": contentTypes[extname(filePath)] ?? "application/octet-stream" });
  createReadStream(filePath).pipe(response);
});

server.listen(3000, "127.0.0.1", () => {
  console.log("Catalog running at http://localhost:3000");
});
