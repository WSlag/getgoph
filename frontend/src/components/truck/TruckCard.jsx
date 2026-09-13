import React, { useState } from 'react';
import { MapPin, Clock, Navigation, Star, Calendar, Users, Truck as TruckIcon, Eye, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatListingPostedAge, formatListingScheduleDate } from '@/utils/listingDateFormatting';
import { sanitizeMessage, sanitizePublicName } from '@/utils/messageUtils';

function TruckThumb({ src, alt, onClick }) {
  const [err, setErr] = useState(false);
  if (err) {
    return (
      <div className="size-16 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center border-2 border-gray-200 dark:border-gray-700">
        <TruckIcon className="size-6 text-gray-400" />
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={alt}
      className="relative size-16 rounded-xl overflow-hidden group/img border-2 border-gray-200 dark:border-gray-700 hover:border-purple-400 focus-visible:border-purple-400 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 transition-all duration-200 cursor-pointer"
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

export function TruckCard({
  id,
  trucker,
  truckerRating = 0,
  truckerTransactions = 0,
  origin,
  destination,
  originCoords,
  destCoords,
  vehicleType,
  plateNumber,
  capacity,
  askingRate,
  availableDate,
  availableDateDisplay,
  description,
  status = 'available',
  uiStatus,
  postedAt,
  postedAtDisplay,
  truckPhotos = [],
  bidCount = 0,
  onViewDetails,
  onBook,
  onViewMap,
  onRefer,
  canBook = true,
  canRefer = false,
  isOwner = false,
  darkMode = false,
  distance,
  estimatedTime,
  timeAgo,
  className,
  compact = false, // New prop for condensed mobile view
}) {
  const displayStatus = uiStatus || status;

  // Status badge styles - professional muted palette
  const statusStyles = {
    available: 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/50 dark:text-green-300 dark:border-green-800',
    'in-transit': 'bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-800',
    booked: 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800',
    offline: 'bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
  };

  // Status labels
  const statusLabels = {
    available: 'AVAILABLE',
    'in-transit': 'IN TRANSIT',
    booked: 'BOOKED',
    offline: 'OFFLINE',
  };

  // Gradient colors for price pill and buttons based on status — keep primary orange for cohesion
  const gradientColors = {
    available: 'bg-gradient-to-r from-orange-500 to-orange-600',
    'in-transit': 'bg-gradient-to-r from-orange-500 to-orange-600',
    booked: 'bg-gradient-to-r from-blue-500 to-blue-600',
    offline: 'bg-gradient-to-r from-gray-400 to-gray-600',
  };

  const currentGradient = gradientColors[displayStatus] || gradientColors.available;
  const displayTrucker = sanitizePublicName(trucker, 'Unknown');
  const displayOrigin = sanitizeMessage(origin || '');
  const displayDestination = sanitizeMessage(destination || '');
  const displayDescription = sanitizeMessage(description || '');

  const formatPrice = (price) => {
    if (!price) return '---';
    return `₱${Number(price).toLocaleString()}`;
  };

  const displayTimeAgo = postedAtDisplay || timeAgo || formatListingPostedAge(postedAt, timeAgo);
  const displayAvailableDate = availableDateDisplay || formatListingScheduleDate(availableDate);

  // Format capacity display
  const displayCapacity = capacity ? `${capacity}` : '';

  // Compact status badge styles for mobile
  const compactStatusStyles = {
    available: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
    open: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
    'in-transit': 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
    booked: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
    offline: 'bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-400',
  };

  // Compact card variant for mobile
  if (compact) {
    const canShowBookAction = Boolean(canBook && !isOwner && onBook);

    return (
      <article
        className={cn(
          "group relative bg-card text-card-foreground rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-[1.01] border border-border",
          className
        )}
        data-testid="truck-compact-card"
      >
        {/* Gradient Accent Bar */}
        <div className={cn("h-1.5", currentGradient)} />

        <button
          type="button"
          className="w-full text-left active:scale-[0.995] transition-transform duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
          onClick={onViewDetails}
          aria-label={`View truck route from ${displayOrigin} to ${displayDestination}`}
          data-testid="truck-compact-body"
        >
          <div className="p-4 px-5">
            {/* Row 1: Status Badge + Vehicle Type + Rate */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
                <Badge
                  className={cn("shrink-0 uppercase tracking-wide text-[10px] font-semibold px-2 py-0.5", compactStatusStyles[displayStatus] || compactStatusStyles.available)}
                >
                  {statusLabels[displayStatus] || 'AVAILABLE'}
                </Badge>
                {vehicleType && (
                  <Badge className="!whitespace-normal bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 uppercase text-[10px] px-2 py-0.5">
                    {vehicleType}
                  </Badge>
                )}
              </div>
              <div className={cn("shrink-0 ml-2 rounded-lg px-3.5 py-1", currentGradient)}>
                <span className="text-sm font-bold text-white">{formatPrice(askingRate)}</span>
              </div>
            </div>

            {/* Row 2: Trucker + Capacity + Rating */}
            <div className="flex min-w-0 items-center gap-2 mb-2">
              <span className="font-semibold text-gray-900 dark:text-white text-sm truncate">{displayTrucker}</span>
              {displayCapacity && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400 shrink-0">{displayCapacity}</span>
                </>
              )}
              {truckerRating > 0 && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-yellow-600 dark:text-yellow-400 flex items-center gap-0.5 shrink-0">
                    <Star className="size-3 fill-yellow-500 text-yellow-500" />
                    {truckerRating.toFixed(1)}
                  </span>
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
              {estimatedTime && <span className="shrink-0">• {estimatedTime}</span>}
            </div>
          </div>
        </button>

        <div className="flex items-center gap-2 px-5 pb-4 -mt-2">
          {canShowBookAction ? (
            <>
              <Button
                variant="default"
                size="sm"
                onClick={onBook}
                className="flex-1 min-h-9 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-0"
                data-testid="truck-compact-book-now"
              >
                Book Now
              </Button>
              <Button variant="outline" size="sm" onClick={onViewDetails} className="min-h-9" data-testid="truck-compact-details">
                Details
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={onViewDetails} className="min-h-9" data-testid="truck-compact-details">
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
              <Badge className={cn("shrink-0 uppercase tracking-wide px-2.5 py-1 text-[10px]", statusStyles[displayStatus] || statusStyles.available)}>
                {statusLabels[displayStatus] || 'AVAILABLE'}
              </Badge>
              <Badge className="!whitespace-normal bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 uppercase px-2.5 py-1 text-[10px]">
                {vehicleType || 'TRUCK'}
              </Badge>
              <span className="text-xs text-gray-500">{displayTimeAgo}</span>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1">{displayTrucker}</h3>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 gap-2">
              {truckerRating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="size-4 text-yellow-500 fill-yellow-500" />
                  <span>{truckerRating.toFixed(1)}</span>
                </div>
              )}
              {displayCapacity && (
                <>
                  {truckerRating > 0 && <span className="text-gray-300 dark:text-gray-600">|</span>}
                  <span>{displayCapacity}</span>
                </>
              )}
              {plateNumber && (
                <>
                  <span className="text-gray-300 dark:text-gray-600">|</span>
                  <span className="font-mono text-xs">{plateNumber}</span>
                </>
              )}
            </div>
          </div>
          <div className={cn("shrink-0 rounded-xl shadow-lg px-3.5 py-2.5", currentGradient)}>
            <p className="text-2xl font-bold text-white">{formatPrice(askingRate)}</p>
          </div>
        </div>

        {/* Booking Request Count Indicator - Only for owner */}
        {isOwner && bidCount > 0 && (
          <div
            className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800 rounded-xl cursor-pointer hover:from-purple-100 hover:to-indigo-100 dark:hover:from-purple-900/30 dark:hover:to-indigo-900/30 transition-all p-3 px-4 mb-4"
            onClick={onViewDetails}
          >
            <div className="size-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Users className="size-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-purple-700 dark:text-purple-400">
                {bidCount} Booking {bidCount === 1 ? 'Request' : 'Requests'}
              </p>
              <p className="text-xs text-purple-600 dark:text-purple-500">Click to view details</p>
            </div>
            <div className="size-6 rounded-full bg-purple-500 flex items-center justify-center animate-pulse">
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
          {estimatedTime && (
            <div className="flex items-center gap-1.5">
              <Clock className="size-4 text-purple-500" />
              <span>{estimatedTime}</span>
            </div>
          )}
          {displayAvailableDate && (
            <div className="flex items-center gap-1.5">
              <Calendar className="size-4 text-green-500" />
              <span>Available: {displayAvailableDate}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {displayDescription && (
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">{displayDescription}</p>
        )}

        {/* Images */}
        {truckPhotos.length > 0 && (
          <div className="flex gap-2 mb-4">
            {truckPhotos.slice(0, 4).map((photo, idx) => (
              <TruckThumb
                key={idx}
                src={photo}
                alt={`${displayTrucker} truck ${displayOrigin}→${displayDestination} image ${idx + 1}`}
                onClick={() => onViewDetails?.()}
              />
            ))}
            {truckPhotos.length > 4 && (
              <div className="size-16 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 text-xs font-medium border-2 border-gray-200 dark:border-gray-700">
                +{truckPhotos.length - 4}
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

        {/* Action Buttons */}
        <div className="flex gap-3">
          {isOwner ? (
            <Button onClick={onViewDetails} className={cn("flex-1 min-h-11 text-white", currentGradient)}>
              View Details
            </Button>
          ) : canBook ? (
            <>
              <Button onClick={onBook} className="flex-1 min-h-11 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0">
                Book Now
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

export default TruckCard;
