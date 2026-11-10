import { spawn } from "node:child_process";
import { connect } from "node:net";
import { join } from "node:path";

const [major, minor] = process.versions.node.split(".").map(Number);
const requiredMajor = 26;
const requiredMinor = 13;
const astroEntry = join(process.cwd(), "node_modules/astro/bin/astro.mjs");
const proxyUrl = process.env.LOCAL_PROXY ?? "http://127.0.0.1:7890";

function canConnect(url) {
  const parsed = new URL(url);
  const port = Number(parsed.port || 80);
  return new Promise((resolve) => {
    const socket = connect({ host: parsed.hostname, port });
    const done = (result) => {
      socket.destroy();
      resolve(result);
    };
    socket.setTimeout(1000, () => done(false));
    socket.once("connect", () => done(true));
    socket.once("error", () => done(false));
  });
}

async function run(nodePath) {
  const env = { ...process.env };
  for (const key of ["CI", "CODEX_CI", "CODEX_MANAGED_BY_NPM"]) delete env[key];
  if (!env.http_proxy && !env.HTTP_PROXY && (await canConnect(proxyUrl))) {
    env.http_proxy = proxyUrl;
    env.https_proxy = proxyUrl;
  }
  const child = spawn(nodePath, [astroEntry, "dev", ...process.argv.slice(2)], {
    env,
    stdio: "inherit",
  });
  child.on("exit", (code) => process.exit(code ?? 1));
}

if (major < requiredMajor || (major === requiredMajor && minor < requiredMinor)) {
  console.error(
    `Node.js ${requiredMajor}.${requiredMinor}.0+ is required; current is ${process.versions.node}.`,
  );
  process.exit(1);
} else {
  await run(process.execPath);
}
