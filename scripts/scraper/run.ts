// Pipeline complète : Discover → Enrich → Sync
// Usage : npm exec -- tsx --env-file=.env.local scripts/scraper/run.ts

import { execSync } from "child_process";
import path from "path";

const SCRIPT_DIR = path.join(__dirname);

function run(script: string) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`Exécution : ${script}`);
  console.log("=".repeat(60) + "\n");

  execSync(
    `npm exec -- tsx --env-file=.env.local ${path.join(SCRIPT_DIR, script)}`,
    { stdio: "inherit", cwd: path.join(__dirname, "../..") }
  );
}

async function main() {
  const start = Date.now();

  console.log("🚀 Pipeline scraper Showfinder\n");

  run("discover.ts");
  run("enrich.ts");
  run("sync.ts");

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\n✅ Pipeline terminée en ${elapsed}s`);
}

main().catch((err) => {
  console.error("❌ Pipeline échouée :", err.message);
  process.exit(1);
});
