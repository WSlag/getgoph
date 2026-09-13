import React, { useState } from 'react';
import { MapPin, Clock, Navigation, Gavel, Package, Eye, Share2, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatListingPostedAge, formatListingScheduleDate } from '@/utils/listingDateFormatting';
import { sanitizeMessage, sanitizePublicName } from '@/utils/messageUtils';

function CargoThumb({ src, alt, onClick }) {
  const [err, setErr] = useState(false);
  if (err) {
    return (
      <div className="size-16 rounded-xl bg-muted dark:bg-stone-800 flex items-center justify-center border border-border">
        <Package className="size-6 text-muted-foreground" />
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={alt}
      className="relative size-16 rounded-xl overflow-hidden group/img border border-border hover:border-primary focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 cursor-pointer"
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        sizes="(max-width:640px) 50vw, 33vw"
        className="size-full object-cover group-hover/img:scale-110 group-focus-visible:scale-110 transition-transform duration-300"
        onError={() => setErr(true)}
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/img:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200" aria-hidden="true" />
    </button>
  );
}

export function CargoCard({
  id,
  shipper,
  company,
  shipperTransactions = 0,
  origin,
  destination,
  originCoords,
  destCoords,
  weight,
  unit = 'kg',
  cargoType,
  vehicleNeeded,
  askingPrice,
  price,
  description,
  pickupDate,
  pickupDateDisplay,
  status = 'open',
  postedAt,
  postedAtDisplay,
  timeAgo,
  cargoPhotos = [],
  images = [],
  bids = [],
  bidCount = 0,
  onViewDetails,
  onBid,
  onViewMap,
  onRefer,
  canBid = true,
  canRefer = false,
  isOwner = false,
  darkMode = false,
  distance,
  estimatedTime,
  time,
  category = 'CARGO',
  gradientClass,
  className,
  compact = false, // New prop for condensed mobile view
}) {
  // Status badge styles — flat semantic on warm neutral (no neon)
  const statusStyles = {
    open: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900',
    waiting: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900',
    negotiating: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900',
    'in-progress': 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900',
    delivered: 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/40 dark:text-green-300 dark:border-green-900',
  };

  // Price pill — single ember solid (AA-compliant), no per-status rainbow
  const gradientColors = {
    open: 'bg-primary',
    waiting: 'bg-primary',
    negotiating: 'bg-primary',
    'in-progress': 'bg-primary',
    delivered: 'bg-primary',
  };

  const formatPrice = (priceValue) => {
    if (!priceValue) return '---';
    if (typeof priceValue === 'string' && priceValue.startsWith('₱')) return priceValue;
    return `₱${Number(priceValue).toLocaleString()}`;
  };

  // Support both naming conventions
  const displayCompany = sanitizePublicName(company || shipper, 'Unknown');
  const displayPrice = price || askingPrice;
  const displayTimeAgo = postedAtDisplay || timeAgo || formatListingPostedAge(postedAt, timeAgo);
  const displayTime = time || estimatedTime;
  const displayImages = images.length > 0 ? images : cargoPhotos;
  const displayWeight = weight ? (unit && unit !== 'kg' ? `${weight} ${unit}` : `${weight} tons`) : '';
  const displayPickupDate = pickupDateDisplay || formatListingScheduleDate(pickupDate);
  const displayOrigin = sanitizeMessage(origin || '');
  const displayDestination = sanitizeMessage(destination || '');
  const displayDescription = sanitizeMessage(description || '');
  const currentGradient = gradientClass || gradientColors[status] || gradientColors.open;

  // Compact status badge styles for mobile — flat, stone-aware
  const compactStatusStyles = {
    open: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    waiting: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    negotiating: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    'in-progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    delivered: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  };

  // Compact card variant for mobile
  if (compact) {
    const canShowBidAction = Boolean(canBid && !isOwner && onBid);

    return (
      <article
        className={cn(
          "group relative bg-card text-card-foreground rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-[1.01] border border-border",
          className
        )}
        data-testid="cargo-compact-card"
      >
        {/* Accent Bar — neutral stone, status via badge only */}
        <div className="h-1 bg-border" />

        <button
          type="button"
          className="w-full text-left active:scale-[0.995] transition-transform duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
          onClick={onViewDetails}
          aria-label={`View cargo from ${displayOrigin} to ${displayDestination}`}
          data-testid="cargo-compact-body"
        >
          <div className="p-4 px-5">
            {/* Row 1: Status Badge + Price */}
            <div className="flex min-w-0 items-center justify-between mb-2">
              <Badge
                className={cn("uppercase tracking-wide text-[10px] font-semibold px-2 py-0.5", compactStatusStyles[status] || compactStatusStyles.open)}
              >
                {status === 'negotiating' ? 'NEGOTIATING' : status.toUpperCase()}
              </Badge>
              <div className="ml-2 shrink-0 rounded-lg bg-primary px-3.5 py-1">
                <span className="text-sm font-bold text-white">{formatPrice(displayPrice)}</span>
              </div>
            </div>

            {/* Row 2: Company + Weight */}
            <div className="flex min-w-0 items-center gap-2 mb-2">
              <span className="font-semibold text-gray-900 dark:text-white text-sm truncate">{displayCompany}</span>
              {displayWeight && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400 shrink-0">{displayWeight}</span>
                </>
              )}
            </div>

            {/* Row 3: Route */}
            <div className="flex min-w-0 items-center gap-1.5">
              <div className="size-2 rounded-full bg-green-500 shrink-0" />
              <span className="text-xs text-gray-700 dark:text-gray-300 truncate">{displayOrigin}</span>
              <span className="text-orange-500 shrink-0">→</span>
              <div className="size-2 rounded-full bg-red-500 shrink-0" />
              <span className="text-xs text-gray-700 dark:text-gray-300 truncate">{displayDestination}</span>
            </div>

            {/* Row 4: Metrics */}
            <div className="flex min-w-0 flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
              {displayTimeAgo && <span className="shrink-0">{displayTimeAgo}</span>}
              {distance && <span className="shrink-0">{distance}</span>}
              {displayTime && <span className="shrink-0">• {displayTime}</span>}
              {bidCount > 0 && (
                <span className="text-orange-600 dark:text-orange-400 font-semibold shrink-0">• {bidCount} {bidCount === 1 ? 'bid' : 'bids'}</span>
              )}
            </div>
          </div>
        </button>

        <div className="flex items-center gap-2 px-5 pb-4 -mt-2">
          {canShowBidAction ? (
            <>
              <Button
                variant="default"
                size="sm"
                onClick={onBid}
                className="flex-1 min-h-9"
                data-testid="cargo-compact-bid-now"
              >
                Bid Now
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onViewDetails}
                className="min-h-9"
                data-testid="cargo-compact-details"
              >
                Details
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onViewDetails}
              className="min-h-9"
              data-testid="cargo-compact-details"
            >
              Details
            </Button>
          )}
        </div>
      </article>
    );
  }

  // Full card view
  return (
    <div
      className={cn(
        "group relative bg-card text-card-foreground rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.01] hover:-translate-y-0.5 border border-border",
        className
      )}
    >
      {/* Accent Bar — neutral */}
      <div className="h-1 bg-border" />

      <div className="p-5 lg:p-6">
        {/* Header Row - Status badges and Price */}
        <div className="flex items-start justify-between mb-4 gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge className={cn("shrink-0 uppercase tracking-wide px-2.5 py-1 text-[10px]", statusStyles[status])}>
                {status}
              </Badge>
              <Badge className="!whitespace-normal bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 uppercase px-2.5 py-1 text-[10px]">
                {category}
              </Badge>
              <span className="text-xs text-gray-500">{displayTimeAgo}</span>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1">{displayCompany}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{displayWeight}</p>
          </div>
          <div className="shrink-0 rounded-xl bg-primary px-3.5 py-2.5 shadow-sm">
            <p className="text-2xl font-bold text-white">{formatPrice(displayPrice)}</p>
          </div>
        </div>

        {/* Bid Count Indicator - Only for owner */}
        {isOwner && bidCount > 0 && (
          <div
            className="flex items-center gap-2 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-xl cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors p-3 px-4 mb-4"
            onClick={onViewDetails}
          >
            <div className="size-8 rounded-full bg-green-600 flex items-center justify-center">
              <Gavel className="size-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-green-700 dark:text-green-300">
                {bidCount} {bidCount === 1 ? 'Bid' : 'Bids'} Received
              </p>
              <p className="text-xs text-green-600 dark:text-green-400">Click to view details</p>
            </div>
            <div className="size-6 rounded-full bg-green-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">{bidCount}</span>
            </div>
          </div>
        )}

        {/* Route Section */}
        <div className="flex items-center rounded-xl bg-muted dark:bg-stone-800/60 border border-border/50 gap-3 mb-4 p-4">
          <div className="flex items-center gap-2 flex-1">
            <div className="size-8 rounded-full bg-white dark:bg-stone-700 border border-border flex items-center justify-center">
              <MapPin className="size-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">From</p>
              <p className="font-medium text-sm text-foreground">{displayOrigin}</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1 px-3">
            <Navigation className="size-4 text-muted-foreground" />
            <div className="h-0.5 w-12 bg-border rounded-full" />
          </div>

          <div className="flex items-center gap-2 flex-1">
            <div className="size-8 rounded-full bg-white dark:bg-stone-700 border border-border flex items-center justify-center">
              <MapPin className="size-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">To</p>
              <p className="font-medium text-sm text-foreground">{displayDestination}</p>
            </div>
          </div>
        </div>

        {/* Distance & Time Details */}
        <div className="flex items-center text-sm text-muted-foreground gap-4 mb-4">
          {distance && (
            <div className="flex items-center gap-1.5">
              <Navigation className="size-4 text-muted-foreground" />
              <span>{distance}</span>
            </div>
          )}
          {displayTime && (
            <div className="flex items-center gap-1.5">
              <Clock className="size-4 text-muted-foreground" />
              <span>{displayTime}</span>
            </div>
          )}
          {displayPickupDate && (
            <div className="flex items-center gap-1.5">
              <Calendar className="size-4 text-muted-foreground" />
              <span>Pickup: {displayPickupDate}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {displayDescription && (
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">{displayDescription}</p>
        )}

        {/* Images */}
        {displayImages.length > 0 && (
          <div className="flex gap-2 mb-4">
            {displayImages.slice(0, 4).map((image, idx) => (
              <CargoThumb
                key={idx}
                src={image}
                alt={`${displayCompany} cargo ${displayOrigin}→${displayDestination} image ${idx + 1}`}
                onClick={() => onViewDetails?.()}
              />
            ))}
            {displayImages.length > 4 && (
              <div className="size-16 rounded-xl bg-muted dark:bg-stone-800 flex items-center justify-center text-muted-foreground text-xs font-medium border border-border">
                +{displayImages.length - 4}
              </div>
            )}
          </div>
        )}

        {/* Deferred Map Preview */}
        <button
          type="button"
          className="relative w-full rounded-xl overflow-hidden bg-muted dark:bg-stone-800/60 border border-border text-left h-[140px] mb-4 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onClick={onViewMap}
          aria-label={`View route map from ${displayOrigin} to ${displayDestination}`}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="size-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                {originCoords && destCoords ? 'Open Interactive Route' : 'Map Preview Unavailable'}
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                {displayOrigin} to {displayDestination}
              </p>
            </div>
          </div>
          <div className="absolute bottom-4 right-4">
            <span className="px-4 py-2 bg-card/90 dark:bg-stone-900/90 backdrop-blur-sm rounded-lg border border-border shadow-sm text-sm font-medium text-foreground">
              View Map
            </span>
          </div>
        </button>

        {/* Bids Info */}
        {bids.length > 0 && (
          <div className="flex items-center justify-between bg-muted dark:bg-stone-800/50 rounded-lg border border-border mb-4 px-3 py-2">
            <span className="text-xs font-medium text-muted-foreground">
              {bids.length} bid{bids.length > 1 ? 's' : ''}
            </span>
            <span className="text-xs text-foreground font-medium">
              Lowest: {formatPrice(Math.min(...bids.map(b => b.amount)))}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {isOwner ? (
            <Button
              onClick={onViewDetails}
              className="flex-1 min-h-11"
            >
              View Details
            </Button>
          ) : canBid ? (
            <>
              <Button
                onClick={onBid}
                className="flex-1 min-h-11"
              >
                Bid Now
              </Button>
              <Button onClick={onViewDetails} variant="outline" className="min-h-11" title="Details">
                <Eye className="size-4 sm:hidden" />
                <span className="hidden sm:inline">Details</span>
              </Button>
              {canRefer && onRefer && (
                <Button onClick={onRefer} variant="outline" className="min-h-11" title="Refer">
                  <Share2 className="size-4 sm:hidden" />
                  <span className="hidden sm:inline">Refer</span>
                </Button>
              )}
            </>
          ) : (
            <>
              <Button onClick={onViewDetails} className="flex-1 min-h-11">
                View Details
              </Button>
              {canRefer && onRefer && (
                <Button onClick={onRefer} variant="outline" className="min-h-11" title="Refer">
                  <Share2 className="size-4 sm:hidden" />
                  <span className="hidden sm:inline">Refer</span>
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CargoCard;
