import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import zlib from "node:zlib";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist");
const base = "/Dynamics_Test";
const port = Number(process.env.PORT || 5173);

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".json": "application/json",
  ".ico": "image/x-icon",
};

function handler(req, res) {
  try {
    const pathname = decodeURIComponent(new URL(req.url, "http://127.0.0.1").pathname);
    if (pathname === "/" || pathname === base) {
      res.writeHead(302, { Location: `${base}/`, "Content-Length": 0, Connection: "close" });
      res.end();
      return;
    }
    if (!pathname.startsWith(`${base}/`)) {
      return finish(req, res, 404, Buffer.from("Not found"), "text/plain; charset=utf-8");
    }

    let relative = pathname.slice(base.length);
    if (relative.endsWith("/")) relative += "index.html";
    const file = path.normalize(path.join(root, relative));
    if (!file.startsWith(root) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      return finish(req, res, 404, Buffer.from("Not found"), "text/plain; charset=utf-8");
    }
    finish(req, res, 200, fs.readFileSync(file), types[path.extname(file)] || "application/octet-stream");
  } catch (error) {
    if (!res.headersSent) finish(req, res, 500, Buffer.from("Server error"), "text/plain; charset=utf-8");
    else res.end();
    console.error(error);
  }
}

function finish(req, res, status, body, type) {
  const headers = {
    "Content-Type": type,
    "Cache-Control": "no-cache",
    Connection: "close",
  };
  let payload = body;
  if (status === 200 && String(req.headers["accept-encoding"] || "").includes("gzip")) {
    payload = zlib.gzipSync(body);
    headers["Content-Encoding"] = "gzip";
  }
  headers["Content-Length"] = payload.length;
  res.writeHead(status, headers);
  res.end(payload);
}

function listen(host) {
  const server = http.createServer(handler);
  server.on("clientError", (_error, socket) => socket.destroy());
  server.listen({ port, host, ipv6Only: false }, () => {
    const address = server.address();
    console.log(`SUSI Portal ready on ${host} port ${address.port}`);
  });
  return server;
}

const ipv6 = listen("::");
ipv6.on("error", (error) => {
  console.error(`IPv6 listen failed (${error.code}); using IPv4 only`);
  listen("0.0.0.0").on("error", (ipv4Error) => {
    console.error(ipv4Error.message);
    process.exit(1);
  });
});
