import { useState, useEffect, useRef, useCallback } from 'react';

const HERO_IMAGE_WIDTHS = [480, 768, 1200];
const HERO_SIZES = '(max-width: 640px) 100vw, (max-width: 1024px) 768px, 1152px';

const HERO_IMAGES = {
  truckers: { alt: 'Driver in truck cab using GetGo app', base: '/assets/hero/truckers', objectPosition: '68% center' },
  cargo: { alt: 'Warehouse manager checking cargo bookings on phone', base: '/assets/hero/cargo', objectPosition: '58% center' },
  network: { alt: 'Truck on highway at sunset representing nationwide coverage', base: '/assets/hero/network', objectPosition: 'center' },
  manage: { alt: 'Logistics manager coordinating shipments', base: '/assets/hero/manage', objectPosition: '62% center' },
  solution: { alt: 'Logistics workflow managed in one app', base: '/assets/hero/solution', objectPosition: '65% center' },
  broker: { alt: 'Broker referral booking workflow', base: '/assets/hero/broker', objectPosition: '55% center' },
};

const STONE_PLACEHOLDER = 'linear-gradient(135deg, #e7e5e4 0%, #d6d3d1 100%)';

const SLIDES = [
  {
    id: 'truckers',
    isImage: true,
    imageKey: 'truckers',
    placeholderGradient: STONE_PLACEHOLDER,
    overlayGradient: 'linear-gradient(90deg, rgba(12,10,9,0.78) 0%, rgba(12,10,9,0.58) 38%, rgba(12,10,9,0.18) 68%, rgba(12,10,9,0.06) 100%)',
    iconBg: 'rgba(255,255,255,0.18)',
    iconBorder: 'rgba(255,255,255,0.3)',
    iconPath: 'M1 3h11v9H1zM12 6h4l3 3v3h-7V6zM5.5 15.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM16.5 15.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z',
    iconViewBox: '0 0 20 18',
    headline: 'PH Cargo Marketplace, Connected',
    sub: 'Post cargo or find loads — Luzon to Mindanao in one place.',
    pills: ['Verified Carriers', 'Live Bidding', 'Secure GCash'],
  },
  {
    id: 'cargo',
    isImage: true,
    imageKey: 'cargo',
    placeholderGradient: STONE_PLACEHOLDER,
    overlayGradient: 'linear-gradient(90deg, rgba(12,10,9,0.78) 0%, rgba(12,10,9,0.58) 38%, rgba(12,10,9,0.18) 68%, rgba(12,10,9,0.06) 100%)',
    iconBg: 'rgba(255,255,255,0.18)',
    iconBorder: 'rgba(255,255,255,0.3)',
    iconPath: 'M1 3h11v9H1zM12 6h4l3 3v3h-7V6zM5.5 15.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM16.5 15.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z',
    iconViewBox: '0 0 20 18',
    headline: 'Book Trucks in Seconds',
    sub: 'Post once, get bids from available truckers — faster than manual dispatch.',
    pills: ['Fast Dispatch', 'Verified Truckers', 'Better Pricing'],
  },
  {
    id: 'network',
    isImage: true,
    imageKey: 'network',
    placeholderGradient: STONE_PLACEHOLDER,
    overlayGradient: 'linear-gradient(90deg, rgba(12,10,9,0.78) 0%, rgba(12,10,9,0.58) 38%, rgba(12,10,9,0.18) 68%, rgba(12,10,9,0.06) 100%)',
    iconBg: 'rgba(255,255,255,0.18)',
    iconBorder: 'rgba(255,255,255,0.3)',
    iconPath: 'M10 1C6.686 1 4 3.686 4 7c0 5 6 12 6 12s6-7 6-12c0-3.314-2.686-6-6-6zm0 8a2 2 0 110-4 2 2 0 010 4z',
    iconViewBox: '0 0 20 21',
    headline: 'Nationwide Coverage You Can Trust',
    sub: 'From Luzon to Mindanao — rated drivers, transparent payments.',
    pills: ['Rated Drivers', 'Secure Payments', 'Real Tracking'],
  },
  {
    id: 'manage',
    isImage: true,
    imageKey: 'manage',
    placeholderGradient: STONE_PLACEHOLDER,
    overlayGradient: 'linear-gradient(90deg, rgba(12,10,9,0.78) 0%, rgba(12,10,9,0.58) 38%, rgba(12,10,9,0.18) 68%, rgba(12,10,9,0.06) 100%)',
    iconBg: 'rgba(255,255,255,0.18)',
    iconBorder: 'rgba(255,255,255,0.3)',
    iconPath: 'M3 3h18v14H3zM8 21h8M12 17v4',
    iconViewBox: '0 0 24 24',
    headline: 'One Platform to Control Logistics',
    sub: 'Post, track, and settle — no more scattered chats and sheets.',
    pills: ['Cargo Marketplace', 'Live Tracking', 'Smart Bidding'],
  },
  {
    id: 'solution',
    isImage: true,
    imageKey: 'solution',
    placeholderGradient: STONE_PLACEHOLDER,
    overlayGradient: 'linear-gradient(90deg, rgba(12,10,9,0.78) 0%, rgba(12,10,9,0.58) 38%, rgba(12,10,9,0.18) 68%, rgba(12,10,9,0.06) 100%)',
    iconBg: 'rgba(255,255,255,0.18)',
    iconBorder: 'rgba(255,255,255,0.3)',
    iconPath: 'M12 2a8 8 0 00-8 8v1.5l-1 2V15h18v-1.5l-1-2V10a8 8 0 00-8-8zm0 20a3 3 0 003-3H9a3 3 0 003 3z',
    iconViewBox: '0 0 24 24',
    headline: 'Cut Empty Backloads',
    sub: 'Turn return trips into revenue — optimizer finds backloads en route.',
    pills: ['Route Optimizer', 'Backload Matches', 'Fuel Savings'],
  },
  {
    id: 'broker',
    isImage: true,
    imageKey: 'broker',
    placeholderGradient: STONE_PLACEHOLDER,
    overlayGradient: 'linear-gradient(90deg, rgba(12,10,9,0.78) 0%, rgba(12,10,9,0.58) 38%, rgba(12,10,9,0.18) 68%, rgba(12,10,9,0.06) 100%)',
    iconBg: 'rgba(255,255,255,0.18)',
    iconBorder: 'rgba(255,255,255,0.3)',
    iconPath: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
    iconViewBox: '0 0 24 22',
    headline: 'Be a Broker — Zero Capital',
    sub: 'Refer deals, earn commission. Zero capital, unlimited income.',
    pills: ['Commission', 'Zero Capital', 'Unlimited Earn'],
    isBrokerCta: true,
  },
];

function buildSrcSet(base, ext) {
  return HERO_IMAGE_WIDTHS.map((width) => `${base}-${width}.${ext} ${width}w`).join(', ');
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    onChange();
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange);
      else mq.removeListener(onChange);
    };
  }, []);
  return reduced;
}

export function HeroCarousel({
  isMobile = false,
  workspaceRole = 'shipper',
  onEarnAsBrokerClick,
  onPostListing,
  onMarketChange,
  onRouteOptimizerClick,
}) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);
  const pauseTimer = useRef(null);
  const containerRef = useRef(null);
  const total = SLIDES.length;
  const prefersReducedMotion = usePrefersReducedMotion();

  const resumeAfterPause = useCallback(() => {
    clearTimeout(pauseTimer.current);
    setIsPaused(true);
    pauseTimer.current = setTimeout(() => setIsPaused(false), 8000);
  }, []);

  const goTo = useCallback(
    (idx) => {
      setCurrent(((idx % total) + total) % total);
      resumeAfterPause();
    },
    [total, resumeAfterPause],
  );

  const prev = useCallback(() => goTo(current - 1), [current, goTo]);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  const togglePause = useCallback(() => {
    setIsPaused((p) => {
      if (p) {
        clearTimeout(pauseTimer.current);
        return false;
      }
      resumeAfterPause();
      return true;
    });
  }, [resumeAfterPause]);

  useEffect(() => {
    if (isPaused || prefersReducedMotion) return;
    const id = setInterval(() => setCurrent((c) => (c + 1) % total), 5000);
    return () => clearInterval(id);
  }, [isPaused, prefersReducedMotion, total]);

  useEffect(() => () => clearTimeout(pauseTimer.current), []);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 50) return;
    delta < 0 ? next() : prev();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      next();
    } else if (e.key === 'Home') {
      e.preventDefault();
      goTo(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      goTo(total - 1);
    }
  };

  const getCtaForSlide = (slide) => {
    if (slide.isBrokerCta) {
      return { label: 'Activate Broker', action: onEarnAsBrokerClick, testId: 'hero-cta-broker' };
    }
    if (slide.id === 'solution') {
      const handler = onRouteOptimizerClick || (() => onMarketChange?.('cargo'));
      return { label: 'Optimize Route', action: handler, testId: 'hero-cta-route' };
    }
    if (slide.id === 'manage') {
      return { label: 'How It Works', action: () => onMarketChange?.('cargo'), testId: 'hero-cta-how' };
    }
    // cargo, truckers, network, etc — role-aware
    if (workspaceRole === 'trucker') {
      return { label: 'Find Loads', action: () => onMarketChange?.('cargo'), testId: 'hero-cta-find' };
    }
    if (workspaceRole === 'broker') {
      return { label: 'Browse Cargo', action: () => onMarketChange?.('cargo'), testId: 'hero-cta-browse' };
    }
    return { label: 'Post Cargo', action: onPostListing, testId: 'hero-cta-post' };
  };

  return (
    <div
      data-testid="hero-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured"
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="relative shrink-0 select-none outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-[16px] lg:rounded-[20px]"
      style={{ margin: isMobile ? '0 0 12px' : '0 0 16px', marginTop: '2px' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        if (!pauseTimer.current) setIsPaused(false);
      }}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {SLIDES[current].headline} — {current + 1} of {total}
      </div>

      <div
        className="relative w-full overflow-hidden rounded-[16px] lg:rounded-[20px] aspect-[16/9] min-h-[220px] lg:aspect-[21/9] lg:min-h-[340px] shadow-[0_4px_24px_rgba(0,0,0,0.12)] lg:shadow-lg"
        style={{ aspectRatio: isMobile ? '16 / 9' : '21 / 9' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex h-full"
          style={{
            width: `${total * 100}%`,
            transform: `translateX(-${(current * 100) / total}%)`,
            transition: prefersReducedMotion ? 'none' : 'transform 500ms cubic-bezier(0.4, 0, 0.2, 1)',
            willChange: 'transform',
          }}
        >
          {SLIDES.map((slide, index) => {
            const cta = getCtaForSlide(slide);
            return (
              <Slide
                key={slide.id}
                slide={slide}
                total={total}
                isMobile={isMobile}
                isActive={index === current}
                isPriority={index === 0}
                cta={cta}
                prefersReducedMotion={prefersReducedMotion}
              />
            );
          })}
        </div>

        <div
          className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10"
          role="tablist"
          aria-label="Carousel slides"
        >
          {SLIDES.map((s, i) => {
            const active = i === current;
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-current={active ? 'true' : undefined}
                aria-label={`Go to slide ${i + 1}: ${s.headline}`}
                data-testid={`hero-dot-${s.id}`}
                onClick={() => goTo(i)}
                className="flex items-center justify-center shrink-0 rounded-full focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
                style={{ minWidth: '44px', minHeight: '44px', padding: 0, border: 'none', background: 'transparent', cursor: 'pointer' }}
              >
                <span
                  aria-hidden="true"
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: active ? '22px' : '8px',
                    height: '8px',
                    background: active ? 'white' : 'rgba(255,255,255,0.5)',
                    display: 'block',
                  }}
                />
              </button>
            );
          })}
        </div>

        <NavArrow direction="left" onClick={prev} isMobile={isMobile} />
        <NavArrow direction="right" onClick={next} isMobile={isMobile} />

        <button
          type="button"
          aria-label={isPaused ? 'Play carousel' : 'Pause carousel'}
          data-testid="hero-pause-toggle"
          onClick={togglePause}
          className="absolute top-3 right-3 z-10 size-7 lg:size-8 rounded-full bg-black/30 backdrop-blur border border-white/30 flex items-center justify-center text-white hover:bg-black/45 focus-visible:ring-2 focus-visible:ring-white transition-colors"
        >
          {isPaused ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="white" aria-hidden="true"><polygon points="2,0 10,6 2,12" /></svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="white" aria-hidden="true"><rect x="2" y="0" width="3" height="12" rx="0.5" /><rect x="7" y="0" width="3" height="12" rx="0.5" /></svg>
          )}
        </button>

        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/20 z-10 overflow-hidden" aria-hidden="true">
          {!prefersReducedMotion && !isPaused && (
            <div
              key={current}
              className="h-full bg-white/90"
              style={{ animation: 'hero-progress 5000ms linear forwards' }}
            />
          )}
          {isPaused && <div className="h-full w-0 bg-white/90" />}
        </div>
      </div>

      <style>{`@keyframes hero-progress { from { width: 0% } to { width: 100% } }`}</style>
    </div>
  );
}

function Slide({ slide, total, isMobile, isActive, isPriority, cta, prefersReducedMotion: _prefersReducedMotion }) {
  const {
    isImage,
    imageKey,
    placeholderGradient,
    overlayGradient,
    iconBg,
    iconBorder,
    iconPath,
    iconViewBox,
    headline,
    sub,
    pills,
  } = slide;

  const visiblePills = pills || [];
  const imageMeta = isImage ? HERO_IMAGES[imageKey] : null;
  const objectPosition = imageMeta?.objectPosition || (isMobile ? '68% center' : 'center');

  const backgroundStyle = isImage
    ? { background: placeholderGradient, backgroundSize: 'cover', backgroundPosition: objectPosition }
    : {};

  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={`${headline} — ${isActive ? 'active' : 'hidden'}`}
      aria-hidden={!isActive}
      className="relative overflow-hidden shrink-0 h-full"
      style={{ width: `${100 / total}%`, ...backgroundStyle }}
    >
      {isImage && imageMeta ? (
        <picture>
          <source type="image/avif" srcSet={buildSrcSet(imageMeta.base, 'avif')} sizes={HERO_SIZES} />
          <source type="image/webp" srcSet={buildSrcSet(imageMeta.base, 'webp')} sizes={HERO_SIZES} />
          <img
            src={`${imageMeta.base}-1200.jpg`}
            srcSet={buildSrcSet(imageMeta.base, 'jpg')}
            sizes={HERO_SIZES}
            width="1200"
            height="675"
            alt={imageMeta.alt}
            loading={isPriority || isActive ? 'eager' : 'lazy'}
            decoding={isPriority ? 'sync' : 'async'}
            fetchPriority={isPriority ? 'high' : 'low'}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition, objectFit: 'cover' }}
          />
        </picture>
      ) : null}

      {isImage && (
        <div className="absolute inset-0 z-[1] pointer-events-none" style={{ background: overlayGradient }} />
      )}

      <div
        className="relative z-[2] h-full flex flex-col justify-center items-start text-left w-full box-border"
        style={{
          padding: isMobile ? '18px 40px 28px 20px' : '34px 72px 52px 56px',
          maxWidth: isMobile ? '100%' : '64%',
          margin: 0,
        }}
      >
        <div className="flex items-start w-full" style={{ gap: isMobile ? '14px' : '18px', marginBottom: isMobile ? '8px' : '16px' }}>
          {!isMobile && (
            <div
              className="size-14 rounded-xl flex items-center justify-center shrink-0 self-start backdrop-blur"
              style={{ background: iconBg, border: `1px solid ${iconBorder}` }}
            >
              <svg width="28" height="28" viewBox={iconViewBox} fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={iconPath} />
              </svg>
            </div>
          )}

          <div className="flex-1 flex flex-col" style={{ gap: isMobile ? '8px' : '12px' }}>
            <h2
              className="m-0 font-extrabold text-white leading-[1.15] tracking-[-0.02em]"
              style={{ fontFamily: 'Outfit, sans-serif', fontSize: isMobile ? '20px' : '36px' }}
            >
              {headline}
            </h2>
            <p className="m-0 leading-[1.4] line-clamp-2" style={{ fontSize: isMobile ? '13px' : '16px', color: 'rgba(255,255,255,0.88)', maxWidth: isMobile ? '100%' : '520px' }}>
              {sub}
            </p>
          </div>
        </div>

        {visiblePills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 lg:gap-2 justify-start">
            {visiblePills.map((p) => (
              <span
                key={p}
                className="font-semibold text-white border rounded-full whitespace-nowrap backdrop-blur tracking-[0.01em]"
                style={{
                  fontSize: isMobile ? '10px' : '13px',
                  background: 'rgba(255,255,255,0.16)',
                  borderColor: 'rgba(255,255,255,0.32)',
                  padding: isMobile ? '3px 9px' : '6px 14px',
                  fontFamily: 'Outfit, sans-serif',
                }}
              >
                {p}
              </span>
            ))}
          </div>
        )}

        {cta?.action && (
          <button
            type="button"
            onClick={cta.action}
            data-testid={cta.testId}
            className="mt-3 lg:mt-4 inline-flex items-center gap-1.5 rounded-full font-bold tracking-[0.01em] text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40 bg-gradient-to-br from-[#ea580c] to-[#c2410c] hover:from-[#c2410c] hover:to-[#9a3412] shadow-[0_8px_24px_rgba(194,65,12,0.22)] active:scale-[0.98] transition-all"
            style={{ padding: isMobile ? '9px 18px' : '11px 22px', fontFamily: 'Outfit, sans-serif', fontSize: isMobile ? '13px' : '14px', alignSelf: 'flex-start' }}
          >
            {cta.label}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="2" y1="7" x2="12" y2="7" />
              <polyline points="8,3 12,7 8,11" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

function NavArrow({ direction, onClick, isMobile }) {
  const isLeft = direction === 'left';
  const size = isMobile ? '28px' : '36px';
  return (
    <button
      type="button"
      aria-label={isLeft ? 'Previous slide' : 'Next slide'}
      onClick={onClick}
      data-testid={`hero-arrow-${direction}`}
      className="absolute top-1/2 -translate-y-1/2 rounded-full bg-white/20 border border-white/30 backdrop-blur flex items-center justify-center cursor-pointer z-10 transition-colors hover:bg-white/30 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/30"
      style={{ [isLeft ? 'left' : 'right']: isMobile ? '8px' : '12px', width: size, height: size, marginTop: '-8px', padding: 0 }}
    >
      <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {isLeft ? <polyline points="9,2 4,7 9,12" /> : <polyline points="5,2 10,7 5,12" />}
      </svg>
    </button>
  );
}

export default HeroCarousel;
