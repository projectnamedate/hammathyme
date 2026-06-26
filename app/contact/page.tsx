import { JsonLd } from "@/components/JsonLd";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { buildBreadcrumbJsonLd, buildContactPageJsonLd, contactMetadata } from "@/lib/seo";

export const metadata = contactMetadata;

export default function Vestibule() {
  return (
    <main className="relative flex min-h-[100svh] w-screen flex-col px-6 pt-32 pb-12 md:px-24 md:pt-40 md:pb-16">
      <JsonLd
        jsonLd={[
          buildContactPageJsonLd(),
          buildBreadcrumbJsonLd([
            { name: "home", path: "/" },
            { name: "contact", path: "/contact" },
          ]),
        ]}
      />
      {/* hero — split poster on desktop, stacked on mobile */}
      <section className="grid flex-1 grid-cols-1 items-center gap-16 md:grid-cols-12 md:gap-x-12">
        {/* left: headline */}
        <div className="md:col-span-7">
          <MaskReveal direction="up" delay={0.3}>
            <h1 className="mt-6 font-display text-[clamp(64px,14vw,260px)] font-light lowercase leading-[0.86] tracking-[-0.05em] text-[var(--ink-0)]">
              let's
              <br />
              <em className="font-serif italic font-normal text-[var(--bloodlust)]">chat</em>
              <span aria-hidden>.</span>
            </h1>
          </MaskReveal>
          <p className="mt-12 max-w-[44ch] font-display font-light text-[clamp(20px,2vw,26px)] leading-[1.45] tracking-[-0.015em] text-[var(--ink-1)]">
            full-time, part-time, contract, project work. i'm open. ai
            pipelines, brand systems, broadcast-grade production.
          </p>
        </div>

        {/* right: side plate of contact lines */}
        <aside className="flex flex-col gap-10 md:col-span-5 md:gap-12 md:border-l md:border-[var(--ink-4)] md:pl-12">
          <ContactLine
            label="email"
            value="hammer@hammer.ad"
            href="mailto:hammer@hammer.ad"
            cursor="copy →"
          />
          <ContactLine label="based" value="la · ny · remote" />
          <ContactLine
            label="availability"
            value={
              <span className="inline-flex items-center gap-3">
                <span
                  aria-hidden
                  className="block h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--cinnamon)]"
                />
                taking projects · 48-hour reply
              </span>
            }
          />
          <ContactLine
            label="rate card"
            value="on request"
            href="mailto:hammer@hammer.ad?subject=rate%20card"
            cursor="ask →"
          />
        </aside>
      </section>

    </main>
  );
}

function ContactLine({
  label,
  value,
  href,
  cursor,
}: {
  label: string;
  value: React.ReactNode;
  href?: string;
  cursor?: string;
}) {
  const valueClass =
    "mt-3 inline-block font-display text-[clamp(20px,1.8vw,26px)] font-light lowercase leading-snug tracking-[-0.02em] text-[var(--ink-0)]";
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)]">
        {label}
      </p>
      {href ? (
        <a
          href={href}
          data-cursor="link"
          data-cursor-label={cursor}
          className={`${valueClass} underline decoration-[var(--ink-3)] underline-offset-8 transition-colors hover:text-[var(--cinnamon)]`}
        >
          {value}
        </a>
      ) : (
        <p className={valueClass}>{value}</p>
      )}
    </div>
  );
}
