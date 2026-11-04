export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`display inline-flex items-center gap-2 whitespace-nowrap text-[16px] min-[360px]:text-[18px] sm:text-[19px] leading-none ${className}`}>
      <span aria-hidden className="h-2 w-2 rounded-full bg-marker" />
      After School
    </span>
  );
}
