import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "out");
const distDir = path.join(root, "dist");
const serverDir = path.join(distDir, "server");
const hostingDir = path.join(distDir, ".openai");

const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".txt", "text/plain; charset=utf-8"],
  [".xml", "application/xml; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
  [".ico", "image/x-icon"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
]);

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name);
      return entry.isDirectory() ? listFiles(fullPath) : fullPath;
    }),
  );

  return files.flat();
}

function routeForFile(filePath) {
  const relativePath = path.relative(outDir, filePath).replaceAll(path.sep, "/");

  if (relativePath === "index.html") {
    return "/";
  }

  if (relativePath.endsWith("/index.html")) {
    return `/${relativePath.replace(/\/index\.html$/, "")}`;
  }

  return `/${relativePath}`;
}

await rm(distDir, { recursive: true, force: true });
await mkdir(serverDir, { recursive: true });
await mkdir(hostingDir, { recursive: true });

const files = await listFiles(outDir);
const assets = Object.fromEntries(
  await Promise.all(
    files.map(async (filePath) => {
      const route = routeForFile(filePath);
      const contentType = mimeTypes.get(path.extname(filePath)) ?? "application/octet-stream";
      const body = await readFile(filePath, "base64");
      return [route, { contentType, body }];
    }),
  ),
);

const worker = `const assets = ${JSON.stringify(assets)};

function normalizePath(pathname) {
  if (assets[pathname]) return pathname;
  if (pathname !== "/" && pathname.endsWith("/") && assets[pathname.slice(0, -1)]) return pathname.slice(0, -1);
  if (assets[\`\${pathname}/index.html\`]) return \`\${pathname}/index.html\`;
  return null;
}

function decodeBase64(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const pathname = normalizePath(url.pathname);
    const asset = pathname ? assets[pathname] : null;

    if (!asset) {
      return new Response("Not found", { status: 404 });
    }

    return new Response(decodeBase64(asset.body), {
      headers: {
        "content-type": asset.contentType,
        "cache-control": pathname.startsWith("/_next/static/")
          ? "public, max-age=31536000, immutable"
          : "public, max-age=300",
      },
    });
  },
};
`;

await writeFile(path.join(serverDir, "index.js"), worker);
await writeFile(
  path.join(hostingDir, "hosting.json"),
  await readFile(path.join(root, ".openai", "hosting.json"), "utf8"),
);
console.log(`Created static worker with ${files.length} assets.`);
