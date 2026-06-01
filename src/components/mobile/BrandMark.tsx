/** Aqua Rudra crowned-shrimp brand mark (own artwork — not a 3rd-party logo). */
export function BrandMark({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center text-center select-none ${className}`}>
      <svg viewBox="0 0 220 150" className="w-52 h-36" xmlns="http://www.w3.org/2000/svg">
        {/* crown */}
        <g>
          <path d="M70 44 L82 18 L100 38 L110 14 L120 38 L138 18 L150 44 Z"
            fill="#f5b301" stroke="#e09b00" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="110" cy="16" r="4" fill="#e23b3b" />
          <circle cx="82" cy="20" r="3.4" fill="#e23b3b" />
          <circle cx="138" cy="20" r="3.4" fill="#e23b3b" />
        </g>
        {/* antennae */}
        <path d="M150 70 C180 56 196 64 210 56" stroke="#d92d20" strokeWidth="4.5" fill="none" strokeLinecap="round" />
        <path d="M150 76 C178 72 192 84 208 86" stroke="#d92d20" strokeWidth="4.5" fill="none" strokeLinecap="round" />
        {/* body */}
        <path d="M150 78
                 C150 60 134 50 110 52
                 C70 55 40 82 42 116
                 C43 138 62 150 84 146
                 C74 136 76 120 92 116
                 C72 112 70 92 88 84
                 C104 77 128 80 140 94
                 C148 88 150 84 150 78 Z"
          fill="#d92d20" />
        {/* segment highlights */}
        <path d="M98 58 C94 72 95 84 104 94" stroke="#fff" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M116 58 C113 72 116 86 126 96" stroke="#fff" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        {/* eye */}
        <circle cx="140" cy="72" r="4.5" fill="#2a0606" />
      </svg>
      <div className="text-3xl font-extrabold tracking-tight">
        <span className="text-rose-600">Aqua</span>{' '}
        <span className="text-neutral-900">Rudra</span>
      </div>
      <div className="mt-1.5 text-sm font-medium text-neutral-500">
        Aqua Rudra — the farmer is king
      </div>
    </div>
  );
}
