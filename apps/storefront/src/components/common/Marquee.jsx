const messages = [
  'ZERO CHEMICALS, EVER',
  'SUN-DRIED FOR 15 DAYS',
  'STONE-GROUND IN SMALL BATCHES',
  'SEALED WITHIN 48 HOURS',
];

export default function Marquee() {
  return (
    <div className="overflow-hidden border-y-2 border-ink bg-ink py-4 text-beige">
      <div className="marquee-track font-mono text-xs font-semibold tracking-wide">
        {[...messages, ...messages].map((message, index) => (
          <span className="px-8" key={`${message}-${index}`}>
            {message}
            <b className="pl-8 text-goldPale">·</b>
          </span>
        ))}
      </div>
    </div>
  );
}
