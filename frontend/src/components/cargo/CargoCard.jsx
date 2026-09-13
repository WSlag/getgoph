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
      <div className="size-16 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center border-2 border-gray-200 dark:border-gray-700">
        <Package className="size-6 text-gray-400" />
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={alt}
      className="relative size-16 rounded-xl overflow-hidden group/img border-2 border-gray-200 dark:border-gray-700 hover:border-orange-400 focus-visible:border-orange-400 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 transition-all duration-200 cursor-pointer"
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
  // Status badge styles - professional muted palette (not neon gradients)
  const statusStyles = {
    open: 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/50 dark:text-green-300 dark:border-green-800',
    waiting: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
    negotiating: 'bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-800',
    'in-progress': 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800',
    delivered: 'bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-950/50 dark:text-violet-300 dark:border-violet-800',
  };

  // Gradient classes for price pill and buttons based on status — keep primary orange for cohesion
  const gradientColors = {
    open: 'bg-gradient-to-r from-orange-500 to-orange-600',
    waiting: 'bg-gradient-to-r from-orange-500 to-orange-600',
    negotiating: 'bg-gradient-to-r from-orange-500 to-orange-600',
    'in-progress': 'bg-gradient-to-r from-blue-500 to-blue-600',
    delivered: 'bg-gradient-to-r from-violet-500 to-violet-600',
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

  // Compact status badge styles for mobile
  const compactStatusStyles = {
    open: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
    waiting: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
    negotiating: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
    'in-progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
    delivered: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
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
        {/* Gradient Accent Bar */}
        <div className={cn("h-1.5", currentGradient)} />

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
              <div className={cn("ml-2 shrink-0 rounded-lg px-3.5 py-1", currentGradient)}>
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
                className="flex-1 min-h-9 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-0"
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
        "group relative bg-card text-card-foreground rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-[1.01] hover:-translate-y-0.5 border border-border",
        className
      )}
    >
      {/* Gradient Accent Bar */}
      <div className={cn("h-1.5", currentGradient)} />

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
          <div className={cn("shrink-0 rounded-xl shadow-lg px-3.5 py-2.5", currentGradient)}>
            <p className="text-2xl font-bold text-white">{formatPrice(displayPrice)}</p>
          </div>
        </div>

        {/* Bid Count Indicator - Only for owner */}
        {isOwner && bidCount > 0 && (
          <div
            className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl cursor-pointer hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30 transition-all p-3 px-4 mb-4"
            onClick={onViewDetails}
          >
            <div className="size-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30">
              <Gavel className="size-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-green-700 dark:text-green-400">
                {bidCount} {bidCount === 1 ? 'Bid' : 'Bids'} Received
              </p>
              <p className="text-xs text-green-600 dark:text-green-500">Click to view details</p>
            </div>
            <div className="size-6 rounded-full bg-green-500 flex items-center justify-center animate-pulse">
              <span className="text-white text-xs font-bold">{bidCount}</span>
            </div>
          </div>
        )}

        {/* Route Section */}
        <div className="flex items-center rounded-xl bg-gray-100 dark:bg-gray-800/60 gap-3 mb-4 p-4">
          <div className="flex items-center gap-2 flex-1">
            <div className="size-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30">
              <MapPin className="size-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">From</p>
              <p className="font-medium text-sm text-gray-900 dark:text-white">{displayOrigin}</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1 px-3">
            <Navigation className="size-4 text-orange-500 animate-pulse" />
            <div className="h-0.5 w-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full" />
          </div>

          <div className="flex items-center gap-2 flex-1">
            <div className="size-8 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30">
              <MapPin className="size-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">To</p>
              <p className="font-medium text-sm text-gray-900 dark:text-white">{displayDestination}</p>
            </div>
          </div>
        </div>

        {/* Distance & Time Details */}
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 gap-4 mb-4">
          {distance && (
            <div className="flex items-center gap-1.5">
              <Navigation className="size-4 text-blue-500" />
              <span>{distance}</span>
            </div>
          )}
          {displayTime && (
            <div className="flex items-center gap-1.5">
              <Clock className="size-4 text-purple-500" />
              <span>{displayTime}</span>
            </div>
          )}
          {displayPickupDate && (
            <div className="flex items-center gap-1.5">
              <Calendar className="size-4 text-green-500" />
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
              <div className="size-16 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 text-xs font-medium border-2 border-gray-200 dark:border-gray-700">
                +{displayImages.length - 4}
              </div>
            )}
          </div>
        )}

        {/* Deferred Map Preview */}
        <button
          type="button"
          className="relative w-full rounded-xl overflow-hidden bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 text-left h-[140px] mb-4 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onClick={onViewMap}
          aria-label={`View route map from ${displayOrigin} to ${displayDestination}`}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="size-12 text-blue-400 mx-auto mb-2 animate-bounce" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {originCoords && destCoords ? 'Open Interactive Route' : 'Map Preview Unavailable'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {displayOrigin} to {displayDestination}
              </p>
            </div>
          </div>
          <div className="absolute bottom-4 right-4">
            <span className="px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg text-sm font-medium text-blue-600 dark:text-blue-400">
              View Map
            </span>
          </div>
        </button>

        {/* Bids Info */}
        {bids.length > 0 && (
          <div className="flex items-center justify-between bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-100 dark:border-orange-800/30 mb-4 px-3 py-2">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {bids.length} bid{bids.length > 1 ? 's' : ''}
            </span>
            <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
              Lowest: {formatPrice(Math.min(...bids.map(b => b.amount)))}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {isOwner ? (
            <Button
              onClick={onViewDetails}
              className={cn("flex-1 min-h-11 text-white", currentGradient)}
            >
              View Details
            </Button>
          ) : canBid ? (
            <>
              <Button
                onClick={onBid}
                className="flex-1 min-h-11 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0"
              >
                Bid Now
              </Button>
              <Button onClick={onViewDetails} variant="outline" className="min-h-11" title="Details">
                <Eye className="size-4 sm:hidden" />
                <span className="hidden sm:inline">Details</span>
              </Button>
              {canRefer && onRefer && (
                <Button onClick={onRefer} variant="outline" className="min-h-11 border-orange-200 text-orange-700 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-300" title="Refer">
                  <Share2 className="size-4 sm:hidden" />
                  <span className="hidden sm:inline">Refer</span>
                </Button>
              )}
            </>
          ) : (
            <>
              <Button onClick={onViewDetails} className={cn("flex-1 min-h-11 text-white", currentGradient)}>
                View Details
              </Button>
              {canRefer && onRefer && (
                <Button onClick={onRefer} variant="outline" className="min-h-11 border-orange-200 text-orange-700 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-300" title="Refer">
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
