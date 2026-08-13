const EMAIL = "felixlin@fintel.capital";

export function Contacts() {
  return (
    <section className="bg-bg">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-5 py-10 text-center">
        <p className="text-sm text-text-muted">
          For questions, contributions or partnership, contact
        </p>
        <a
          href={`mailto:${EMAIL}`}
          className="text-sm text-text-soft transition-colors hover:text-accent"
        >
          {EMAIL}
        </a>
      </div>
    </section>
  );
}
