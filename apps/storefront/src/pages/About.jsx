import { processSteps } from '../data/placeholders';
export default function About() {
  return (
    <>
      <section className="container-shell py-20 md:py-28">
        <p className="eyebrow">Our story</p>
        <h1 className="section-title max-w-3xl">
          Turmeric should taste like a place, not a factory.
        </h1>
        <div className="mt-10 grid gap-10 text-lg leading-relaxed text-inkSoft md:grid-cols-2">
          <p>
            Nature's Golden Gift began with a simple question: why did the
            turmeric in our kitchens smell less alive than the roots we grew up
            with?
          </p>
          <p>
            We work with partner farms, follow the harvest closely, and keep the
            chain short. That means fewer shortcuts between soil, stone, pouch,
            and your kitchen.
          </p>
        </div>
      </section>
      <section className="bg-ink py-20 text-beige md:py-28">
        <div className="container-shell">
          <p className="eyebrow text-goldPale">From root to jar</p>
          <h2 className="section-title max-w-xl">
            Four steps, nothing skipped.
          </h2>
          <div className="mt-14 grid gap-8 md:grid-cols-4">
            {processSteps.map(([number, title, text]) => (
              <article key={number}>
                <p className="font-mono text-goldPale">{number}</p>
                <h3 className="mt-4 font-display text-xl font-semibold">
                  {title}
                </h3>
                <p className="mt-3 text-sm text-beige/65">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
