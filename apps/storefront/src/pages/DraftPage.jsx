export default function DraftPage({ title, ownerInput }) {
  return (
    <section className="container-shell py-20 md:py-28">
      <div className="mb-8 rounded-md bg-warning-bg px-4 py-3 text-sm text-warning-fg">
        Draft - content pending
      </div>
      <p className="eyebrow">Information</p>
      <h1 className="section-title">{title}</h1>
      <h2 className="mt-10 font-display text-2xl">
        [OWNER TO PROVIDE: {ownerInput}]
      </h2>
    </section>
  );
}
