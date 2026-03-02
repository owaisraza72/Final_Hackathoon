import { Link, useNavigate } from "react-router-dom";
import { 
  LogOut, 
  User, 
  Menu, 
  X, 
  Home, 
  Code2, 
  Settings,
  HeartPulse,
  ChevronDown,
  Bell,
  Sparkles,
  Activity,
  Stethoscope,
  Shield,
  Moon,
  Sun,
  LogIn
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { ROUTES } from "@/utils/constants";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const { isAuthenticated, user, logout, isLoggingOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [theme, setTheme] = useState('light');
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside for user menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileOpen]);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      toast.success("Successfully logged out", {
        icon: "👋",
        duration: 3000,
      });
      setMobileOpen(false);
      setUserMenuOpen(false);
      navigate(ROUTES.LOGIN);
    } catch {
      toast.error("Logout failed", {
        icon: "⚠️",
        description: "Please try again",
      });
    }
  };

  const navLinks = [
    { label: "Home", path: ROUTES.HOME, icon: Home, color: "from-blue-500 to-cyan-500" },
    { label: "About", path: ROUTES.ABOUT, icon: HeartPulse, color: "from-teal-500 to-emerald-500" },
    { label: "Contact", path: ROUTES.CONTACT, icon: Stethoscope, color: "from-purple-500 to-pink-500" },
  ];

  const roleColors = {
    ADMIN: "from-red-500 to-orange-500",
    DOCTOR: "from-blue-500 to-cyan-500",
    RECEPTIONIST: "from-purple-500 to-pink-500",
    PATIENT: "from-green-500 to-emerald-500",
  };

  const getRoleBadgeColor = (role) => {
    return roleColors[role] || "from-gray-500 to-gray-600";
  };

  const userMenuItems = [
    { label: "Profile", icon: User, path: "/profile", color: "text-blue-500" },
    { label: "Settings", icon: Settings, path: "/settings", color: "text-gray-500" },
    { label: "Activity", icon: Activity, path: "/activity", color: "text-teal-500" },
  ];

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    // Here you would implement actual theme switching logic
    toast.success(`${theme === 'light' ? 'Dark' : 'Light'} mode activated`, {
      icon: theme === 'light' ? '🌙' : '☀️',
    });
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? "bg-white/95 backdrop-blur-xl border-b border-slate-200/50 shadow-lg" 
            : "bg-white/80 backdrop-blur-sm border-b border-transparent"
        }`}
      >
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          {/* Logo with animation */}
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-3 group"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center overflow-hidden shadow-lg"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 90, 0]
                }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent"
              />
              <HeartPulse className="h-6 w-6 text-white relative z-10" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl font-black bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                ClinicOS
              </span>
              <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Healthcare OS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation with hover effects */}
          <nav className="hidden md:flex items-center gap-5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <motion.div
                  key={link.path}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={link.path}
                    className="relative px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors group overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity"
                      style={{
                        background: `linear-gradient(to right, ${link.color.split(' ')[0]}, ${link.color.split(' ')[2]})`
                      }}
                    />
                    <div className="relative z-10 flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Right side actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5 text-slate-600" />
              ) : (
                <Sun className="h-5 w-5 text-slate-600" />
              )}
            </motion.button>

            {/* Notifications */}
            {isAuthenticated && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors"
                onClick={() => toast.info("Notifications coming soon!")}
              >
                <Bell className="h-5 w-5 text-slate-600" />
                {notifications > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 h-4 w-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-full text-[10px] text-white font-bold flex items-center justify-center"
                  >
                    {notifications}
                  </motion.span>
                )}
              </motion.button>
            )}

            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                {/* User Profile Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100/50 hover:from-slate-100 hover:to-slate-200/50 transition-all border border-slate-200/50"
                >
                  <div className="relative">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`absolute inset-0 rounded-full bg-gradient-to-r ${getRoleBadgeColor(user?.role)} opacity-50 blur-sm`}
                    />
                    <div className={`relative h-9 w-9 rounded-full bg-gradient-to-r ${getRoleBadgeColor(user?.role)} flex items-center justify-center shadow-lg`}>
                      <span className="text-sm font-bold text-white">
                        {user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-xs text-slate-500">Signed in as</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r ${getRoleBadgeColor(user?.role)} text-white uppercase tracking-wider`}>
                        {user?.role}
                      </span>
                    </div>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-50"
                    >
                      {/* User header */}
                      <div className="p-4 bg-gradient-to-r from-teal-500 to-cyan-500">
                        <p className="text-white text-sm font-medium">{user?.name}</p>
                        <p className="text-teal-100 text-xs">{user?.email}</p>
                      </div>

                      {/* Menu items */}
                      <div className="p-2">
                        {userMenuItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <motion.div
                              key={item.label}
                              whileHover={{ x: 5 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Link
                                to={item.path}
                                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors"
                                onClick={() => setUserMenuOpen(false)}
                              >
                                <Icon className={`h-4 w-4 ${item.color}`} />
                                <span className="text-sm font-medium text-slate-700">{item.label}</span>
                              </Link>
                            </motion.div>
                          );
                        })}
                        
                        <div className="my-2 h-px bg-slate-100" />
                        
                        <motion.button
                          whileHover={{ x: 5 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors group"
                        >
                          <LogOut className="h-4 w-4 text-red-500 group-hover:text-red-600" />
                          <span className="text-sm font-medium text-red-600 group-hover:text-red-700">
                            {isLoggingOut ? "Logging out..." : "Logout"}
                          </span>
                          {isLoggingOut && (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity }}
                              className="h-3 w-3 border-2 border-red-500 border-t-transparent rounded-full ml-auto"
                            />
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    asChild
                    className="rounded-xl hover:bg-teal-50 hover:text-teal-600"
                  >
                    <Link to={ROUTES.LOGIN} className="flex items-center gap-2">
                      <LogIn className="h-4 w-4" />
                      Sign In
                    </Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="sm" 
                    asChild
                    className="rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-lg shadow-teal-500/20"
                  >
                    <Link to={ROUTES.REGISTER} className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Get Started
                    </Link>
                  </Button>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="md:hidden p-2.5 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {mobileOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                >
                  <X className="h-5 w-5 text-slate-600" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                >
                  <Menu className="h-5 w-5 text-slate-600" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              ref={mobileMenuRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-20 right-0 bottom-0 w-full max-w-sm bg-white/95 backdrop-blur-xl border-l border-slate-200 shadow-2xl z-40 md:hidden overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                {/* User Profile Summary */}
                {isAuthenticated && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl p-4 text-white"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                        <span className="text-xl font-bold">{user?.name?.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-semibold">{user?.name}</p>
                        <p className="text-sm text-teal-100">{user?.email}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm uppercase tracking-wider`}>
                        {user?.role}
                      </span>
                      <span className="text-xs text-teal-100">ID: #{user?.id?.slice(0, 8)}</span>
                    </div>
                  </motion.div>
                )}

                {/* Navigation Links */}
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3">
                    Navigation
                  </p>
                  {navLinks.map((link, index) => {
                    const Icon = link.icon;
                    return (
                      <motion.div
                        key={link.path}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          to={link.path}
                          className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                          onClick={() => setMobileOpen(false)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`h-8 w-8 rounded-lg bg-gradient-to-r ${link.color} flex items-center justify-center`}>
                              <Icon className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-medium text-slate-700">{link.label}</span>
                          </div>
                          <motion.div
                            whileHover={{ x: 5 }}
                            className="text-slate-400"
                          >
                            →
                          </motion.div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Quick Actions */}
                {isAuthenticated && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3">
                      Quick Actions
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {userMenuItems.slice(0, 2).map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <motion.div
                            key={item.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 + 0.3 }}
                          >
                            <Link
                              to={item.path}
                              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                              onClick={() => setMobileOpen(false)}
                            >
                              <Icon className={`h-5 w-5 ${item.color}`} />
                              <span className="text-xs font-medium text-slate-600">{item.label}</span>
                            </Link>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Theme Toggle */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <span className="font-medium text-slate-700">Theme</span>
                  <div className="flex items-center gap-2">
                    {theme === 'light' ? (
                      <>
                        <Sun className="h-4 w-4 text-slate-500" />
                        <span className="text-sm text-slate-500">Light</span>
                      </>
                    ) : (
                      <>
                        <Moon className="h-4 w-4 text-slate-500" />
                        <span className="text-sm text-slate-500">Dark</span>
                      </>
                    )}
                  </div>
                </motion.button>

                {/* Logout Button (Mobile) */}
                {isAuthenticated && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full gap-2 justify-center border-red-200 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                    >
                      <LogOut className="h-4 w-4" />
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </Button>
                  </motion.div>
                )}

                {/* Auth Buttons (Mobile - Unauthenticated) */}
                {!isAuthenticated && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-2"
                  >
                    <Button variant="outline" className="w-full rounded-xl" asChild>
                      <Link to={ROUTES.LOGIN} className="flex items-center justify-center gap-2">
                        <LogIn className="h-4 w-4" />
                        Sign In
                      </Link>
                    </Button>
                    <Button className="w-full rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500" asChild>
                      <Link to={ROUTES.REGISTER} className="flex items-center justify-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Get Started
                      </Link>
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;