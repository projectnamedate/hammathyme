import { ImageResponse } from "next/og";
import { HammerSocialImage, size, contentType } from "./social-image";
import { getHammerSocialFonts } from "./social-fonts";

export { size, contentType };

export default async function Image() {
  return new ImageResponse(<HammerSocialImage />, {
    ...size,
    fonts: await getHammerSocialFonts(),
  });
}
