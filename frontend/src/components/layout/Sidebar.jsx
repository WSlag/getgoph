import { Ship, Package, Truck, Plus, CheckCircle, Route, Navigation, FileText, Shield, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar({
  currentRole = 'shipper',
  workspaceRole = 'shipper',
  activeMarket = 'cargo',
  onMarketChange,
  cargoCount = 0,
  truckCount = 0,
  openCargoCount = 0,
  availableTrucksCount = 0,
  activeShipmentsCount = 0,
  myBidsCount = 0,
  pendingContractsCount = 0,
  activeContractsCount = 0,
  pendingPaymentsCount = 0,
  isAdmin = false,
  onPostClick,
  onRouteOptimizerClick,
  onMyBidsClick,
  onContractsClick,
  onBrokerClick,
  isBroker = false,
  onPaymentReviewClick,
  className,
}) {
  // Account type display — single ember brand, neutral icon (no rainbow per role)
  const accountConfig = {
    shipper: {
      icon: Ship,
      label: 'Shipper Account',
      bgGradient: 'from-primary to-[var(--primary-hover)]',
      shadowColor: 'shadow-primary/20',
      badgeBg: 'bg-white/20',
      badgeText: 'text-white',
    },
    trucker: {
      icon: Truck,
      label: 'Trucker Account',
      bgGradient: 'from-primary to-[var(--primary-hover)]',
      shadowColor: 'shadow-primary/20',
      badgeBg: 'bg-white/20',
      badgeText: 'text-white',
    },
    broker: {
      icon: Users,
      label: 'Broker Workspace',
      bgGradient: 'from-primary to-[var(--primary-hover)]',
      shadowColor: 'shadow-primary/20',
      badgeBg: 'bg-white/20',
      badgeText: 'text-white',
    },
  };

  const displayRole = workspaceRole || currentRole;
  const config = accountConfig[displayRole] || accountConfig.shipper;
  const AccountIcon = config.icon;

  return (
    <aside
      className={cn(
        "w-72 h-[calc(100vh-73px)] sticky top-[73px] bg-card dark:bg-stone-950 border-r border-border flex flex-col",
        className
      )}
    >
      {/* Account Type Display (Read-only) */}
      <div className="border-b border-border" style={{ padding: '24px' }}>
        <div className={cn(
          "flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br",
          config.bgGradient,
          "text-white shadow-lg",
          config.shadowColor
        )}>
          <div className="size-10 rounded-lg bg-white/20 flex items-center justify-center">
            <AccountIcon className="size-5" />
          </div>
          <div>
            <p className="text-xs text-white/70 uppercase tracking-wide">Logged in as</p>
            <p className="font-semibold">{config.label}</p>
          </div>
        </div>
      </div>

      {/* Browse Section */}
      <div className="border-b border-border" style={{ padding: '24px' }}>
        <p className="text-xs text-muted-foreground uppercase tracking-wide" style={{ marginBottom: '10px' }}>Browse</p>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={() => onMarketChange?.('cargo')}
            className={cn(
              "w-full flex items-center gap-3 px-4 rounded-xl transition-all duration-300 hover:scale-[1.01] active:scale-95 group border",
              activeMarket === 'cargo'
                ? "bg-primary-soft dark:bg-orange-950/30 text-primary border-primary/20"
                : "text-muted-foreground hover:bg-accent hover:text-foreground border-transparent hover:border-border"
            )}
            style={{ paddingTop: '12px', paddingBottom: '12px', paddingLeft: '16px', paddingRight: '16px' }}
          >
            <Package className="size-5" />
            <span className="font-medium flex-1 text-left">{displayRole === 'broker' ? 'Cargo' : displayRole === 'trucker' ? 'Find Cargo' : 'My Cargo'}</span>
            <span className={cn(
              "text-xs px-2 py-0.5 rounded-full",
              activeMarket === 'cargo'
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}>
              {cargoCount}
            </span>
          </button>

          <button
            onClick={() => onMarketChange?.('trucks')}
            className={cn(
              "w-full flex items-center gap-3 px-4 rounded-xl transition-all duration-300 hover:scale-[1.01] active:scale-95 group border",
              activeMarket === 'trucks'
                ? "bg-primary-soft dark:bg-orange-950/30 text-primary border-primary/20"
                : "text-muted-foreground hover:bg-accent hover:text-foreground border-transparent hover:border-border"
            )}
            style={{ paddingTop: '12px', paddingBottom: '12px', paddingLeft: '16px', paddingRight: '16px' }}
          >
            <Truck className="size-5" />
            <span className="font-medium flex-1 text-left">{displayRole === 'broker' ? 'Trucks' : displayRole === 'trucker' ? 'My Trucks' : 'Find Truck'}</span>
            <span className={cn(
              "text-xs px-2 py-0.5 rounded-full",
              activeMarket === 'trucks'
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}>
              {truckCount}
            </span>
          </button>

          {/* My Bids - For Truckers */}
          {displayRole === 'trucker' && (
            <button
              onClick={onMyBidsClick}
              className="w-full flex items-center gap-3 px-4 rounded-xl transition-all duration-300 hover:scale-[1.01] active:scale-95 group text-muted-foreground hover:bg-accent hover:text-foreground border border-transparent hover:border-border"
              style={{ paddingTop: '12px', paddingBottom: '12px', paddingLeft: '16px', paddingRight: '16px' }}
            >
              <FileText className="size-5 text-muted-foreground" />
              <span className="font-medium flex-1 text-left">My Bids</span>
              {myBidsCount > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                  {myBidsCount}
                </span>
              )}
            </button>
          )}

          {/* My Bookings - For Shippers */}
          {displayRole === 'shipper' && (
            <button
              onClick={onMyBidsClick}
              className="w-full flex items-center gap-3 px-4 rounded-xl transition-all duration-300 hover:scale-[1.01] active:scale-95 group text-muted-foreground hover:bg-accent hover:text-foreground border border-transparent hover:border-border"
              style={{ paddingTop: '12px', paddingBottom: '12px', paddingLeft: '16px', paddingRight: '16px' }}
            >
              <FileText className="size-5 text-muted-foreground" />
              <span className="font-medium flex-1 text-left">My Bookings</span>
              {myBidsCount > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                  {myBidsCount}
                </span>
              )}
            </button>
          )}

          {/* Contracts - For All Users */}
          <button
            onClick={onContractsClick}
            className="w-full flex items-center gap-3 px-4 rounded-xl transition-all duration-300 hover:scale-[1.01] active:scale-95 group text-muted-foreground hover:bg-accent hover:text-foreground border border-transparent hover:border-border"
            style={{ paddingTop: '12px', paddingBottom: '12px', paddingLeft: '16px', paddingRight: '16px' }}
          >
            <FileText className="size-5 text-muted-foreground" />
            <span className="font-medium flex-1 text-left">My Contracts</span>
            {pendingContractsCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200 animate-pulse">
                {pendingContractsCount}
              </span>
            )}
            {pendingContractsCount === 0 && activeContractsCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                {activeContractsCount}
              </span>
            )}
          </button>

          {/* Broker Hub */}
          <button
            onClick={onBrokerClick}
            className="w-full flex items-center gap-3 px-4 rounded-xl transition-all duration-300 hover:scale-[1.01] active:scale-95 group text-muted-foreground hover:bg-accent hover:text-foreground border border-transparent hover:border-border"
            style={{ paddingTop: '12px', paddingBottom: '12px', paddingLeft: '16px', paddingRight: '16px' }}
          >
            <Users className="size-5 text-muted-foreground" />
            <span className="font-medium flex-1 text-left">{isBroker ? 'Broker Dashboard' : 'Broker Program'}</span>
          </button>

          {/* Admin Dashboard - Admin Only */}
          {isAdmin && onPaymentReviewClick && (
            <button
              onClick={onPaymentReviewClick}
              className="w-full flex items-center gap-3 px-4 rounded-xl transition-all duration-300 hover:scale-[1.01] active:scale-95 group bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900"
              style={{ paddingTop: '12px', paddingBottom: '12px', paddingLeft: '16px', paddingRight: '16px' }}
            >
              <Shield className="size-5" />
              <span className="font-medium flex-1 text-left">Admin Dashboard</span>
              {pendingPaymentsCount > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-600 text-white animate-pulse">
                  {pendingPaymentsCount}
                </span>
              )}
            </button>
          )}
        </nav>
      </div>

      {/* Post Cargo Button */}
      <div style={{ padding: '24px' }}>
        <button
          onClick={onPostClick}
          className="w-full px-6 rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:scale-[1.01] active:scale-95 group"
          style={{ paddingTop: '15px', paddingBottom: '15px' }}
        >
          <div className="flex items-center justify-center gap-2">
            <Plus className="size-5 group-hover:rotate-90 transition-transform duration-300" />
            <span className="font-medium">
              {displayRole === 'shipper' ? 'Post Cargo' : displayRole === 'trucker' ? 'Post Truck' : 'Post Listing'}
            </span>
          </div>
        </button>

        {/* Route Optimizer - Truckers */}
        {displayRole === 'trucker' && onRouteOptimizerClick && (
          <button
            onClick={onRouteOptimizerClick}
            className="w-full rounded-xl bg-card dark:bg-stone-900 text-muted-foreground font-medium hover:bg-accent hover:text-foreground border border-border transition-all duration-300 hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2"
            style={{ marginTop: '12px', paddingTop: '12px', paddingBottom: '12px' }}
          >
            <Route className="size-5 text-muted-foreground" />
            <span>Route Optimizer</span>
          </button>
        )}
      </div>

      {/* Spacer to push Quick Stats to bottom */}
      <div className="flex-1" />

      {/* Quick Stats */}
      <div className="border-t border-border mt-auto" style={{ padding: '24px' }}>
        <p className="text-xs text-muted-foreground uppercase tracking-wide" style={{ marginBottom: '15px' }}>Quick Stats</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted border border-border hover:shadow-sm transition-all duration-300 cursor-pointer group">
            <div className="size-10 rounded-lg bg-card border border-border flex items-center justify-center">
              <CheckCircle className="size-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Open Cargo</p>
              <p className="font-bold text-foreground">{openCargoCount}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted border border-border hover:shadow-sm transition-all duration-300 cursor-pointer group">
            <div className="size-10 rounded-lg bg-card border border-border flex items-center justify-center">
              <Truck className="size-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Available Trucks</p>
              <p className="font-bold text-foreground">{availableTrucksCount}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted border border-border hover:shadow-sm transition-all duration-300 cursor-pointer group">
            <div className="size-10 rounded-lg bg-card border border-border flex items-center justify-center">
              <Navigation className="size-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Active Shipments</p>
              <p className="font-bold text-foreground">{activeShipmentsCount}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
