import { ImageResponse } from "next/og";
import { HammerSocialImage, size, contentType } from "./social-image";

export { size, contentType };

export default function Image() {
  return new ImageResponse(<HammerSocialImage />, { ...size });
}
