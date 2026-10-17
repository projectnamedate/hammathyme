#!/usr/bin/env node
// gen-audio.mjs: the game's music (Suno v6-wild on Evolink, two takes) and sushi-bar ambience (ElevenLabs sound
// generation, a seamless loop). Keys come from the environment or the provider env file (splat/scripts/lib.mjs).
// Every file is versioned and logged in ledger.json; nothing is overwritten.
// Rights: Suno via Evolink is cleared for portfolio use only (suno skill).
// usage: node games/sushi-scramble/scripts/gen-audio.mjs [music|ambience|all]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { appendLedger, secret, sleep } from "../../../splat/scripts/lib.mjs";

const PROJECT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(PROJECT, "audio-src");
fs.mkdirSync(OUT, { recursive: true });
const which = process.argv[2] || "all";

const nextVersioned = (prefix, ext) => {
  for (let v = 1; ; v++) {
    const p = path.join(OUT, `${prefix}-v${String(v).padStart(2, "0")}${ext}`);
    try {
      fs.closeSync(fs.openSync(p, "wx"));
      return p;
    } catch (e) {
      if (e.code !== "EEXIST") throw e;
    }
  }
};

const STYLE =
  "Cool, minimal, technical techno instrumental for a video game. 122 BPM, steady metronomic 4/4. A tight dry kick, crisp closed hi-hats and small glitch ticks on the sixteenths, a deep round sub bass, a clean plucked koto riff in a minor pentatonic scale answered by short breathy shakuhachi phrases, cold digital pads underneath. Dark, focused and confident. A loopable groove that is already running from the first bar: no intro, no breakdown, no ending.";
const PROMPT = "[Groove – kick, hats, sub bass, koto riff]\n[Groove – shakuhachi answers the koto]\n[Groove – glitch ticks, pads widen]\n[Groove – full, steady, loops back]";
const NEG = "vocals, singing, choir, marimba, ukulele, whistle, claps, happy, cartoon, jingle, commercial, orchestral, brass, intro, outro, fade";

async function music() {
  const key = secret("EVOLINK_API_KEY");
  const api = "https://api.evolink.ai/v1";
  const res = await fetch(`${api}/audios/generations`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "suno-v6-wild-beta", custom_mode: true, instrumental: true, title: "Sushi Scramble", style: STYLE, prompt: PROMPT, negative_tags: NEG, duration: 90, style_weight: 0.75 }),
  });
  const task = await res.json();
  if (!res.ok || !task.id) throw new Error(`music: ${res.status} ${JSON.stringify(task).slice(0, 300)}`);
  console.log(`music: task ${task.id}`);
  for (let i = 0; i < 120; i++) {
    await sleep(5000);
    const s = await (await fetch(`${api}/tasks/${task.id}`, { headers: { Authorization: `Bearer ${key}` } })).json();
    if (s.status === "failed") throw new Error(`music failed ${JSON.stringify(s).slice(0, 300)}`);
    if (s.status !== "completed") continue;
    const songs = Array.isArray(s.result_data) ? s.result_data : s.result_data?.songs || [];
    for (const song of songs) {
      const f = nextVersioned("music", ".mp3");
      fs.writeFileSync(f, Buffer.from(await (await fetch(song.audio_url)).arrayBuffer()));
      console.log(`  ${path.basename(f)} ${song.duration}s`);
    }
    appendLedger(PROJECT, { id: "music", provider: "evolink", model: "suno-v6-wild-beta", requestId: task.id, status: "completed", cost: s.usage?.cost?.usd ?? null, style: STYLE });
    return;
  }
  throw new Error("music timed out");
}

async function ambience() {
  const key = secret("ELEVENLABS_API_KEY");
  const text =
    "Busy Japanese kaiten sushi bar ambience: the soft mechanical hum and gentle rattle of a conveyor belt, ceramic plates clinking now and then, distant indistinct chatter of diners, warm room tone. No music, no clear words.";
  const res = await fetch("https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128", {
    method: "POST",
    headers: { "xi-api-key": key, "Content-Type": "application/json" },
    body: JSON.stringify({ text, duration_seconds: 30, prompt_influence: 0.5, loop: true, model_id: "eleven_text_to_sound_v2" }),
  });
  if (!res.ok) throw new Error(`ambience: ${res.status} ${(await res.text()).slice(0, 300)}`);
  const f = nextVersioned("ambience", ".mp3");
  fs.writeFileSync(f, Buffer.from(await res.arrayBuffer()));
  appendLedger(PROJECT, { id: "ambience", provider: "elevenlabs", model: "eleven_text_to_sound_v2", status: "completed", requestId: res.headers.get("request-id"), text });
  console.log(`  ${path.basename(f)}`);
}

if (which === "music" || which === "all") await music();
if (which === "ambience" || which === "all") await ambience();
