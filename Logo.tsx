export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`display inline-flex items-baseline gap-[0.18em] text-[22px] leading-none ${className}`}>
      <span>After</span>
      <span className="relative">
        School
        <span aria-hidden className="absolute -bottom-[3px] left-0 h-[3px] w-full bg-margin" />
      </span>
    </span>
  );
}
