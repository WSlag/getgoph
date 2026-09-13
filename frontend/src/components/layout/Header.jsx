import { Home, TrendingUp, ClipboardList, MessageSquare, Bell, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/shared/Logo';
import { ProfileDropdown } from '@/components/shared/ProfileDropdown';

export function Header({
  activeTab = 'home',
  onTabChange,
  darkMode = false,
  onToggleDarkMode,
  unreadNotifications = 0,
  unreadMessages = 0,
  userInitial = 'U',
  currentRole = 'shipper',
  workspaceRole = 'shipper',
  availableWorkspaces = ['shipper'],
  onWorkspaceChange,
  isBroker = false,
  isAdmin = false,
  onLogout,
  onNotificationClick,
  onProfileClick,
  onBrokerClick,
  onMyProfile,
  onNotificationSettings,
  onHelpSupport,
  onAdminDashboard,
  user = {},
  mobileVisible = true,
  headerRef = null,
}) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'tracking', label: 'Tracking', icon: TrendingUp },
    { id: 'activity', label: 'Activity', icon: ClipboardList },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ];
  return (
    <header
      ref={headerRef}
      data-testid="app-header"
      className={cn(
        "z-50 backdrop-blur-xl bg-card/80 dark:bg-stone-900/80 border-b border-border",
        // Desktop: sticky, stays in layout flow
        "lg:sticky lg:top-0 lg:shrink-0",
        // Mobile: fixed overlay, never affects layout
        "max-lg:fixed max-lg:top-0 max-lg:left-0 max-lg:right-0",
        "max-lg:duration-300 max-lg:ease-out",
        "max-lg:transition-[opacity,border-color,transform]",
        mobileVisible
          ? "max-lg:opacity-100 max-lg:pointer-events-auto max-lg:border-border max-lg:translate-y-0"
          : "max-lg:opacity-0 max-lg:pointer-events-none max-lg:border-transparent max-lg:-translate-y-full"
      )}
    >
      <div style={{ padding: '16px 24px' }}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Logo className="hidden sm:flex" />
          <Logo className="flex sm:hidden" size="sm" />

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const showBadge = item.id === 'messages' && unreadMessages > 0;

              return (
                <button
                  key={item.id}
                  aria-label={item.label}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => {
                    if (item.id === 'notifications' && onNotificationClick) {
                      onNotificationClick();
                    } else if (item.id === 'broker' && onBrokerClick) {
                      onBrokerClick();
                    } else if (item.id === 'profile' && onProfileClick) {
                      onProfileClick();
                    } else if (onTabChange) {
                      onTabChange(item.id);
                    }
                  }}
                  className={cn(
                    "group relative rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 border",
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                      : "bg-muted/50 dark:bg-stone-800/50 text-muted-foreground dark:text-stone-300 border-transparent hover:bg-accent hover:text-foreground hover:border-border backdrop-blur-sm"
                  )}
                  style={{ paddingTop: '10px', paddingBottom: '10px', paddingLeft: '20px', paddingRight: '20px' }}
                >
                  <div className="flex items-center gap-2 relative">
                    <Icon className="size-4" />
                    <span className="font-medium text-sm">{item.label}</span>
                    {showBadge && (
                      <Badge className="absolute -top-2 -right-2 size-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs border-2 border-white dark:border-gray-900">
                        {unreadMessages > 9 ? '9+' : unreadMessages}
                      </Badge>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button
              onClick={onNotificationClick}
              aria-label="Open notifications"
              title="Notifications"
              className="relative size-9 rounded-xl bg-muted/50 dark:bg-stone-800/50 hover:bg-accent border border-transparent hover:border-border flex items-center justify-center transition-all duration-300 hover:shadow-sm hover:scale-105 active:scale-95 backdrop-blur-sm"
            >
              <Bell className="size-5 text-muted-foreground" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 size-5 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full border-2 border-white dark:border-gray-900">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              title={darkMode ? 'Light mode' : 'Dark mode'}
              className="size-8 rounded-lg bg-muted/50 dark:bg-stone-800/50 hover:bg-accent border border-transparent hover:border-border flex items-center justify-center transition-all duration-300 hover:shadow-sm hover:scale-105 active:scale-95 backdrop-blur-sm"
            >
              {darkMode ? (
                <Sun className="size-5 text-amber-500" />
              ) : (
                <Moon className="size-5 text-gray-700 dark:text-gray-400" />
              )}
            </button>

            {/* User Avatar with Profile Dropdown */}
            <ProfileDropdown
              user={{ ...user, initial: userInitial }}
              currentRole={currentRole}
              workspaceRole={workspaceRole}
              availableWorkspaces={availableWorkspaces}
              onWorkspaceChange={onWorkspaceChange}
              darkMode={darkMode}
              onToggleDarkMode={onToggleDarkMode}
              isBroker={isBroker}
              isAdmin={isAdmin}
              onMyActivity={() => onTabChange?.('activity')}
              onBrokerDashboard={onBrokerClick}
              onMyProfile={onMyProfile}
              onNotificationSettings={onNotificationSettings}
              onHelpSupport={onHelpSupport}
              onAdminDashboard={onAdminDashboard}
              onLogout={onLogout}
            >
              <button
                className={cn(
                  "size-9 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-md shadow-primary/20 cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200 border-2 border-primary/20 bg-primary"
                )}
              >
                <span>{userInitial}</span>
              </button>
            </ProfileDropdown>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
