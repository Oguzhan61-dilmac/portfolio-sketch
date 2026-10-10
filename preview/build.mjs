import { build } from "esbuild";
import postcss from "postcss";
import tailwind from "@tailwindcss/postcss";
import fs from "node:fs";
import path from "node:path";
const root = path.resolve(".");
fs.writeFileSync("preview/assets.ts", `export const PORTRAIT = "data:image/webp;base64,${fs.readFileSync("public/portrait-sketch.webp").toString("base64")}";\n`);
const js = await build({
  entryPoints: ["preview/entry.tsx"], bundle: true, minify: true, write: false, format: "iife",
  jsx: "automatic", target: "es2020",
  alias: { "@": root, "next/image": path.resolve("preview/image-shim.tsx"), "server-only": path.resolve("preview/empty.ts") },
  define: { "process.env.NEXT_PUBLIC_MEDIUM_USERNAME": '"dilmacoguz33"', "process.env": "{}", "process.env.NODE_ENV": '"production"', "process.env.GITHUB_TOKEN": "undefined" },
});
const css = (await postcss([tailwind()]).process(fs.readFileSync("preview/style.css", "utf8"), { from: path.resolve("preview/style.css") })).css;
const html = `<title>Oğuzhan Dilmaç Portfolyo</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Kalam:wght@400;700&family=IBM+Plex+Sans:wght@400;500&display=swap">
<style>${css.replace(/<\/style/gi, "<\\/style")}</style>
<div id="root"></div>
<script>${js.outputFiles[0].text.replace(/<\/script/gi, "<\\/script")}</script>`;
fs.writeFileSync("/tmp/claude-0/portfolio-preview.html", html);
console.log("bytes", html.length);
