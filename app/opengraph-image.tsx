import { createSocialImage, socialImageSize } from "@/lib/social-image";

export const alt = "BotStopper from Techaro: Good traffic gets through. Bad bots don't.";
export const size = socialImageSize;
export const contentType = "image/png";

export default function Image() {
  return createSocialImage(
    "Good traffic gets through. Bad bots don't.",
    "A smarter front door for the modern web.",
  );
}
