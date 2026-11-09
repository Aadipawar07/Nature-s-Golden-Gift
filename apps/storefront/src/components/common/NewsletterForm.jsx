export default function NewsletterForm() {
  return (
    <form
      className="flex flex-wrap items-center gap-3"
      onSubmit={(event) => event.preventDefault()}
    >
      <input
        className="form-control min-w-[220px] border-white/30 bg-white/10 placeholder:text-beige/60"
        type="email"
        required
        placeholder="you@email.com"
        aria-label="Email address"
      />
      <button
        className="shrink-0 rounded-full bg-beige px-6 py-3 font-bold text-goldDeep"
        type="submit"
      >
        Get my code
      </button>
    </form>
  );
}
