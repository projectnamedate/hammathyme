import { RouteStub } from "@/components/RouteStub";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: `agents · ${slug}` };
}

export default async function AgentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <RouteStub kicker={`agents · ${slug}`} title="character" slug={`/agents/${slug}`} />;
}
