import { readFile } from "node:fs/promises";
import { join } from "node:path";

const FONT_DIR = join(process.cwd(), "app/_fonts");

const fontData = Promise.all([
  readFile(join(FONT_DIR, "Outfit-Black-Social.ttf")),
  readFile(join(FONT_DIR, "Geist-Regular-Social.ttf")),
  readFile(join(FONT_DIR, "Geist-Medium-Social.ttf")),
  readFile(join(FONT_DIR, "GeistMono-Medium-Social.ttf")),
]);

export async function getHammerSocialFonts() {
  const [outfitBlack, geistRegular, geistMedium, geistMonoMedium] = await fontData;

  return [
    { name: "Outfit", data: outfitBlack, weight: 900 as const, style: "normal" as const },
    { name: "Geist", data: geistRegular, weight: 400 as const, style: "normal" as const },
    { name: "Geist", data: geistMedium, weight: 500 as const, style: "normal" as const },
    { name: "Geist Mono", data: geistMonoMedium, weight: 500 as const, style: "normal" as const },
  ];
}
