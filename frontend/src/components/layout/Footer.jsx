import { Link } from "react-router-dom";
import { useState } from "react";
import { ROUTES } from "@/utils/constants";
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  HeartPulse,
  Stethoscope,
  Activity,
  Shield,
  ChevronRight,
  Sparkles,
  Send,
  CheckCircle,
  ArrowUp,
} from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Show scroll to top button after scrolling
  useState(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail("");
    }
  };

  const footerLinks = [
    {
      title: "Product",
      icon: Stethoscope,
      links: [
        { label: "Features", href: "#features", icon: Sparkles },
        { label: "Pricing", href: "#pricing", icon: Activity },
        { label: "Security", href: "#security", icon: Shield },
        { label: "Status", href: "#status", icon: CheckCircle },
      ],
    },
    {
      title: "Company",
      icon: HeartPulse,
      links: [
        { label: "About", href: ROUTES.ABOUT, icon: Stethoscope },
        { label: "Contact", href: ROUTES.CONTACT, icon: Mail },
        { label: "Blog", href: "#blog", icon: Sparkles },
        { label: "Careers", href: "#careers", icon: Activity },
      ],
    },
    {
      title: "Resources",
      icon: Activity,
      links: [
        { label: "Documentation", href: "#docs", icon: Stethoscope },
        { label: "API Reference", href: "#api", icon: Sparkles },
        { label: "GitHub", href: "#github", icon: Github },
        { label: "Community", href: "#community", icon: Users },
      ],
    },
  ];

  const socialLinks = [
    {
      icon: Github,
      href: "#",
      label: "GitHub",
      color: "hover:bg-[#333] hover:text-white",
    },
    {
      icon: Linkedin,
      href: "#",
      label: "LinkedIn",
      color: "hover:bg-[#0077b5] hover:text-white",
    },
    {
      icon: Twitter,
      href: "#",
      label: "Twitter",
      color: "hover:bg-[#1DA1F2] hover:text-white",
    },
    {
      icon: Mail,
      href: "#",
      label: "Email",
      color: "hover:bg-teal-500 hover:text-white",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <>
      {/* Scroll to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: showScrollTop ? 1 : 0,
          scale: showScrollTop ? 1 : 0,
          y: showScrollTop ? 0 : 20,
        }}
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl shadow-2xl shadow-teal-500/30 flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer group"
      >
        <ArrowUp className="h-5 w-5 group-hover:animate-bounce" />
      </motion.button>

      <footer className="relative bg-gradient-to-b from-slate-900 to-slate-950 text-white overflow-hidden">
        {/* Animated Medical Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.15, 0.1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-full blur-3xl"
          />

          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.2, 0.1],
              rotate: [0, -90, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
              delay: 2,
            }}
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl"
          />

          {/* Floating medical icons */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              x: [0, 20, 0],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-20 right-20 text-white/5"
          >
            <HeartPulse size={80} />
          </motion.div>

          <motion.div
            animate={{
              y: [0, 20, 0],
              x: [0, -20, 0],
              rotate: [0, -10, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute bottom-20 left-20 text-white/5"
          >
            <Stethoscope size={80} />
          </motion.div>

          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>

        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12"
          >
            {/* Brand Section - Larger */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-2 space-y-6"
            >
              <Link to="/" className="flex items-center gap-3 group">
                <motion.div
                  whileHover={{ rotate: 180, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="h-12 w-12 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-teal-500/30 relative overflow-hidden"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 90, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent"
                  />
                  <HeartPulse className="h-6 w-6 text-white relative z-10" />
                </motion.div>
                <div>
                  <span className="text-2xl font-black bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                    ClinicOS
                  </span>
                  <span className="block text-[8px] font-bold uppercase tracking-[0.2em] text-slate-500">
                    Healthcare OS
                  </span>
                </div>
              </Link>

              <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                Production-ready healthcare management platform for modern
                clinics. Secure, scalable, and intelligent solutions for medical
                professionals.
              </p>

              {/* Newsletter Signup */}
              <form onSubmit={handleSubscribe} className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Mail className="h-3 w-3" />
                  Stay Updated
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full h-12 pl-5 pr-24 bg-white/5 border border-slate-700 rounded-2xl text-sm text-white placeholder:text-slate-600 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all outline-none"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-4 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1"
                  >
                    Subscribe
                    <Send className="h-3 w-3" />
                  </motion.button>
                </div>
                {subscribed && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-teal-400 flex items-center gap-1"
                  >
                    <CheckCircle className="h-3 w-3" />
                    Thanks for subscribing!
                  </motion.p>
                )}
              </form>

              {/* Social Links */}
              <div className="flex items-center gap-3 pt-2">
                {socialLinks.map(({ icon: Icon, href, label, color }) => (
                  <motion.a
                    key={label}
                    href={href}
                    aria-label={label}
                    whileHover={{ y: -3, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`h-10 w-10 rounded-xl bg-white/5 border border-slate-700 flex items-center justify-center text-slate-400 transition-all duration-300 ${color}`}
                  >
                    <Icon className="h-4 w-4" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Footer Links */}
            {footerLinks.map((section) => (
              <motion.div
                key={section.title}
                variants={itemVariants}
                className="space-y-5"
              >
                <div className="flex items-center gap-2">
                  <section.icon className="h-4 w-4 text-teal-500" />
                  <h4 className="text-sm font-black uppercase tracking-wider text-slate-300">
                    {section.title}
                  </h4>
                </div>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <motion.li
                      key={link.label}
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Link
                        to={link.href}
                        className="text-sm text-slate-500 hover:text-teal-400 transition-colors flex items-center gap-2 group"
                      >
                        <link.icon className="h-3 w-3 text-slate-600 group-hover:text-teal-400" />
                        {link.label}
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all" />
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          {/* Divider with animation */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="my-10 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"
          />

          {/* Bottom Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm"
          >
            <p className="text-slate-500 flex items-center gap-2">
              <span>© {currentYear} ClinicOS.</span>
              <span className="text-slate-700">|</span>
              <span className="text-teal-500/70">All rights reserved.</span>
            </p>

            <div className="flex items-center gap-6">
              {["Privacy Policy", "Terms of Service", "Contact"].map(
                (item, index) => (
                  <motion.a
                    key={item}
                    href="#"
                    whileHover={{ y: -2 }}
                    className="text-slate-500 hover:text-teal-400 transition-colors text-xs font-medium uppercase tracking-wider flex items-center gap-1 group"
                  >
                    {item}
                    <ArrowUp className="h-3 w-3 rotate-45 opacity-0 group-hover:opacity-100 transition-all" />
                  </motion.a>
                ),
              )}
            </div>

            {/* Certification Badges */}
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="px-3 py-1.5 bg-white/5 rounded-xl border border-slate-700"
              >
                <span className="text-[8px] font-black uppercase text-slate-400 flex items-center gap-1">
                  <Shield className="h-3 w-3 text-teal-500" />
                  HIPAA Compliant
                </span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="px-3 py-1.5 bg-white/5 rounded-xl border border-slate-700"
              >
                <span className="text-[8px] font-black uppercase text-slate-400 flex items-center gap-1">
                  <Shield className="h-3 w-3 text-cyan-500" />
                  ISO 27001
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-500" />
      </footer>
    </>
  );
};

export default Footer;

// Missing Users import
const Users = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
