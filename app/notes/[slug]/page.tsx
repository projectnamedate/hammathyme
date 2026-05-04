import { RouteStub } from "@/components/RouteStub";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: `notes · ${slug}` };
}

export default async function NotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <RouteStub kicker={`notes · ${slug}`} title="essay" slug={`/notes/${slug}`} />;
}
