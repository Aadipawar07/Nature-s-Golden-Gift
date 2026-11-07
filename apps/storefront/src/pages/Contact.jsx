export default function Contact() {
  return (
    <section className="container-shell grid gap-12 py-20 md:py-28 lg:grid-cols-2">
      <div>
        <p className="eyebrow">Contact</p>
        <h1 className="section-title">Let's talk turmeric.</h1>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-inkSoft">
          Questions about a batch, your order, or bringing Nature's Golden Gift
          to your kitchen? Write to us.
        </p>
        <div className="mt-8 space-y-3 font-mono text-sm text-inkSoft">
          <p>hello@naturesgoldengift.in</p>
          <p>Mon–Sat · 10:00–18:00 IST</p>
        </div>
      </div>
      <form
        className="rounded-3xl border-2 border-ink/10 bg-beigeCard p-7"
        onSubmit={(event) => event.preventDefault()}
      >
        <label className="mb-4 block text-sm font-semibold">
          Your name
          <input className="form-control mt-2" required />
        </label>
        <label className="mb-4 block text-sm font-semibold">
          Email
          <input className="form-control mt-2" type="email" required />
        </label>
        <label className="mb-4 block text-sm font-semibold">
          Message
          <textarea className="form-control mt-2 min-h-32" required />
        </label>
        <button className="btn-primary rounded-full px-7 py-3 font-bold text-beige">
          Send message
        </button>
      </form>
    </section>
  );
}
