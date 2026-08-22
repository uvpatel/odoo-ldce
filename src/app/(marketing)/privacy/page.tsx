export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-8 px-4 py-14 sm:py-20">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">GlobeTrotter</p>
        <h1 className="font-serif text-4xl font-semibold tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated August 22, 2026</p>
      </div>
      <section className="space-y-4 text-sm leading-7 text-muted-foreground">
        <p>
          GlobeTrotter stores the account, trip, itinerary, collaborator, and budget information needed to provide the travel-planning service. We do not display account email addresses on public itineraries.
        </p>
        <p>
          Trips are private by default. You control collaborator access, public visibility, share-link copying, and link expiration from each trip&apos;s settings. Public links may be viewed by anyone who receives them.
        </p>
        <p>
          You can update your profile, change your email or password, revoke public links, remove saved destinations, and delete your account from Settings. Account deletion permanently removes data according to the application&apos;s database retention policy.
        </p>
      </section>
    </article>
  );
}
