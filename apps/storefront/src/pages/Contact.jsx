import site from '../config/site';
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
        <div className="mt-8 space-y-3 text-sm text-ink-500">
          {site.supportEmail && <p>{site.supportEmail}</p>}
          {site.supportPhone && <p>{site.supportPhone}</p>}
          {site.supportHours && <p>{site.supportHours}</p>}
        </div>
      </div>
      <div className="rounded-xl border border-cream-300 bg-cream-100 p-7 text-ink-500">
        <p>
          Support details will be added when the owner configuration is ready.
        </p>
      </div>
    </section>
  );
}
