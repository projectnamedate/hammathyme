import { RouteStub } from "@/components/RouteStub";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: `work · ${slug}` };
}

export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <RouteStub kicker={`work · ${slug}`} title="case study" slug={`/work/${slug}`} />;
}
