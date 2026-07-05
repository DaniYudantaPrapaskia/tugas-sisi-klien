import { Redis } from "@upstash/redis";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, "..", "..", "db.json");
const db = JSON.parse(readFileSync(dbPath, "utf-8"));

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const collections = ["mahasiswa", "kelas", "dosen", "users", "roles", "matkul"];

async function seed() {
  for (const name of collections) {
    if (db[name]) {
      await redis.set(`tugas-sisi-klien:${name}`, JSON.stringify(db[name]));
      console.log(`Seeded ${name}: ${db[name].length} records`);
    }
  }
  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
