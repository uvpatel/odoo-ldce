export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-8 px-4 py-14 sm:py-20">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">GlobeTrotter</p>
        <h1 className="font-serif text-4xl font-semibold tracking-tight">Terms of Service</h1>
        <p className="text-sm text-muted-foreground">Last updated August 22, 2026</p>
      </div>
      <section className="space-y-4 text-sm leading-7 text-muted-foreground">
        <p>
          GlobeTrotter is a planning tool. Travel dates, prices, availability, safety information, and third-party activity details can change, so verify important arrangements with the relevant provider before traveling.
        </p>
        <p>
          You are responsible for the content you add or publish and for granting collaborator access only to people you trust. Do not upload unlawful content or use the service to expose another person&apos;s private information.
        </p>
        <p>
          Shared itineraries are read-only unless the owner grants collaborator access. Copying is available only when the owner enables it. We may restrict accounts that misuse the service or compromise other travelers&apos; data.
        </p>
      </section>
    </article>
  );
}
