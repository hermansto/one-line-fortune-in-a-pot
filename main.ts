import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const fortune =
  "Your future is bright, like the windowsill at noon. Water yourself, grow slowly, and never trust a cat.";

// The bounty caps the line at 120 characters; refuse to emit an over-long line.
if (fortune.length > 120) {
  throw new Error(`fortune is ${fortune.length} characters, over the 120 limit`);
}
if (fortune.endsWith("\n")) {
  throw new Error("fortune must not end with a newline");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });

const target = join(outDir, "entry.txt");
// Write the bare line only: no trailing newline, so the file is exactly the line's bytes.
writeFileSync(target, fortune, "utf8");

const roundTrip = readFileSync(target, "utf8");
if (roundTrip !== fortune) {
  throw new Error("entry.txt does not match the fortune line exactly");
}
if (Buffer.byteLength(roundTrip, "utf8") !== Buffer.byteLength(fortune, "utf8")) {
  throw new Error("entry.txt byte length does not match the fortune line");
}

console.log(`Wrote ${fortune.length} characters to ${target}`);
