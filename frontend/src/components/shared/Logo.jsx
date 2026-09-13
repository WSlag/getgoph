import { cn } from '@/lib/utils';

export function Logo({ className = "", showText = true, size = "default" }) {
  const sizes = {
    sm: { img: 32, text: "text-xl" },
    default: { img: 40, text: "text-2xl" },
    lg: { img: 48, text: "text-3xl" },
  };

  const currentSize = sizes[size] || sizes.default;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <img
        src="/icons/getgo-mark.svg"
        alt="GetGo"
        width={currentSize.img}
        height={currentSize.img}
        className="rounded-[22%] shadow-sm"
        style={{ borderRadius: `${Math.round(currentSize.img * 0.22)}px` }}
      />
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-0.5">
            <span
              className={cn("font-black tracking-tight text-primary", currentSize.text)}
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Get
            </span>
            <span
              className={cn("font-black tracking-tight text-foreground", currentSize.text)}
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Go
            </span>
          </div>
          <p
            className="text-[10px] text-muted-foreground tracking-[0.18em] font-semibold uppercase"
            style={{ marginTop: '-2px' }}
          >
            Cargo Marketplace
          </p>
        </div>
      )}
    </div>
  );
}

export default Logo;
