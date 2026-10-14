import { getDoc, getDocParams } from "@/lib/docs";
import { createSocialImage } from "@/lib/social-image";

export function generateStaticParams() {
  return getDocParams();
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params;
  const doc = getDoc(slug);
  return createSocialImage(doc.title, doc.description);
}
