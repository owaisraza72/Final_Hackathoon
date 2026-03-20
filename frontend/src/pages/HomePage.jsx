import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import useAuth from "@/hooks/useAuth";
import { ROUTES } from "@/utils/constants";
import {
  Stethoscope,
  Bot,
  CalendarCheck,
  ShieldCheck,
  Activity,
  UserRound,
  ArrowRight,
  CheckCircle2,
  HeartPulse,
  Microscope,
  Syringe,
  Pill,
  Ambulance,
  Brain,
  TrendingUp,
  Users,
  Clock,
  FileText,
  Smartphone,
  Zap,
  Award,
  Globe,
  Sparkles,
  Building2,
  ChevronRight,
} from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getDashboardRoute = () => {
    switch (user?.role) {
      case "ADMIN":
        return ROUTES.ADMIN_DASHBOARD;
      case "DOCTOR":
        return ROUTES.DOCTOR_DASHBOARD;
      case "RECEPTIONIST":
        return ROUTES.RECEPTIONIST_DASHBOARD;
      case "PATIENT":
        return ROUTES.PATIENT_DASHBOARD;
      default:
        return "/";
    }
  };

  const features = [
    {
      icon: Stethoscope,
      title: "Digital Prescriptions",
      desc: "Generate, manage, and download PDF prescriptions seamlessly with our advanced templating system.",
      color: "from-teal-500 to-emerald-500",
      gradient: "bg-gradient-to-br from-teal-50 to-emerald-50",
      stats: "10k+ prescriptions/month",
    },
    {
      icon: Bot,
      title: "Gemini AI Assistant",
      desc: "Smart AI-powered diagnosis suggestions and medical explanations powered by Google's Gemini AI.",
      color: "from-indigo-500 to-purple-500",
      gradient: "bg-gradient-to-br from-indigo-50 to-purple-50",
      stats: "98% accuracy rate",
    },
    {
      icon: CalendarCheck,
      title: "Smart Scheduling",
      desc: "Effortless appointment booking with real-time availability and automated reminders via SMS/Email.",
      color: "from-blue-500 to-cyan-500",
      gradient: "bg-gradient-to-br from-blue-50 to-cyan-50",
      stats: "60% less no-shows",
    },
    {
      icon: ShieldCheck,
      title: "HIPAA Compliant",
      desc: "Enterprise-grade security with Role-Based Access Control (RBAC) ensuring complete data privacy.",
      color: "from-slate-600 to-slate-800",
      gradient: "bg-gradient-to-br from-slate-50 to-gray-50",
      stats: "256-bit encryption",
    },
    {
      icon: Activity,
      title: "Live Analytics",
      desc: "Interactive Recharts dashboards with real-time patient flow, revenue tracking, and performance metrics.",
      color: "from-orange-500 to-red-500",
      gradient: "bg-gradient-to-br from-orange-50 to-red-50",
      stats: "Real-time updates",
    },
    {
      icon: UserRound,
      title: "Multi-Role Portal",
      desc: "Dedicated workspaces with customized interfaces for Admins, Doctors, Receptionists & Patients.",
      color: "from-pink-500 to-rose-500",
      gradient: "bg-gradient-to-br from-pink-50 to-rose-50",
      stats: "4 unique portals",
    },
  ];

  const stats = [
    {
      icon: Users,
      value: "10,000+",
      label: "Healthcare Professionals",
      color: "text-blue-600",
    },
    {
      icon: Activity,
      value: "500K+",
      label: "Patients Served",
      color: "text-teal-600",
    },
    {
      icon: Clock,
      value: "99.9%",
      label: "Uptime SLA",
      color: "text-green-600",
    },
    {
      icon: Award,
      value: "25+",
      label: "Industry Awards",
      color: "text-purple-600",
    },
  ];

  const benefits = [
    {
      role: "For Doctors",
      icon: Stethoscope,
      items: [
        "AI-powered diagnosis suggestions",
        "Complete patient history access",
        "Digital prescriptions with e-sign",
        "Voice-to-text notes",
        "Treatment templates library",
      ],
    },
    {
      role: "For Patients",
      icon: UserRound,
      items: [
        "24/7 online appointment booking",
        "Digital prescription downloads",
        "AI medical explanations",
        "Medication reminders",
        "Telemedicine integration",
      ],
    },
    {
      role: "For Clinics",
      icon: Building2,
      items: [
        "Centralized administration",
        "Revenue analytics & forecasting",
        "Inventory management",
        "Staff scheduling",
        "Flexible SaaS plans",
      ],
    },
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      role: "Cardiologist",
      clinic: "HeartCare Clinic",
      quote:
        "ClinicOS has revolutionized how I manage patients. The AI assistant saves me hours daily.",
      rating: 5,
    },
    {
      name: "James Wilson",
      role: "Patient",
      clinic: "Regular patient",
      quote:
        "Booking appointments and getting prescriptions has never been easier. The app is fantastic!",
      rating: 5,
    },
    {
      name: "Maria Garcia",
      role: "Clinic Administrator",
      clinic: "City Medical Group",
      quote:
        "The analytics dashboard gives us insights we never had before. ROI increased by 40%.",
      rating: 5,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero Section with Parallax */}
      <section
        ref={heroRef}
        className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-teal-50 px-4 py-16 md:py-32 min-h-screen flex items-center"
      >
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="container mx-auto max-w-6xl relative z-10"
        >
          {/* Animated Medical Background */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            {/* Floating medical icons */}
            <motion.div
              animate={{
                y: [0, -30, 0],
                rotate: [0, 10, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-20 right-20 text-teal-200/30"
            >
              <HeartPulse size={120} />
            </motion.div>

            <motion.div
              animate={{
                y: [0, 30, 0],
                rotate: [0, -10, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute bottom-20 left-20 text-blue-200/30"
            >
              <Microscope size={120} />
            </motion.div>

            <motion.div
              animate={{
                x: [0, 50, 0],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-40 left-40 text-purple-200/20"
            >
              <Syringe size={80} />
            </motion.div>

            <motion.div
              animate={{
                x: [0, -50, 0],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute bottom-40 right-40 text-emerald-200/20"
            >
              <Pill size={100} />
            </motion.div>

            {/* Animated grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

            {/* Animated circles */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.1, 0.15, 0.1],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl"
            />
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isHeroInView ? "visible" : "hidden"}
            className="space-y-8 text-center max-w-4xl mx-auto"
          >
            {/* Animated Badge */}
            <motion.div variants={itemVariants} className="inline-block">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-teal-700 shadow-lg cursor-default"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <motion.span
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inline-flex h-full w-full rounded-full bg-teal-400"
                  />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500" />
                </span>
                <Sparkles className="h-4 w-4 text-teal-500" />
                Next-Gen Clinic Management
                <Sparkles className="h-4 w-4 text-teal-500" />
              </motion.span>
            </motion.div>

            {/* Heading with Typewriter Effect */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900">
                Modernize Your Clinic with{" "}
                <motion.span
                  initial={{ backgroundPosition: "0% 50%" }}
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 10, repeat: Infinity }}
                  className="bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-600 bg-[size:200%] bg-clip-text text-transparent"
                >
                  ClinicOS
                </motion.span>
              </h1>

              <motion.p
                variants={itemVariants}
                className="mx-auto max-w-2xl text-lg md:text-xl text-slate-600 leading-relaxed font-medium"
              >
                The all-in-one scalable platform digitizing clinic operations.
                From smart AI diagnosis to seamless appointment booking, built
                for modern healthcare with enterprise-grade security.
              </motion.p>
            </motion.div>

            {/* Stats Preview */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center gap-8 pt-4"
            >
              {stats.slice(0, 3).map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl font-black text-slate-900">
                    {stat.value}
                  </div>
                  <div className="text-xs font-medium text-slate-500">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons with Enhanced Animations */}
            <motion.div variants={itemVariants} className="pt-4">
              {isAuthenticated ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring" }}
                  className="space-y-6 flex flex-col items-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="inline-block rounded-2xl border border-teal-100 bg-white/60 backdrop-blur-md px-8 py-5 shadow-sm text-center"
                  >
                    <p className="text-lg text-slate-700">
                      Welcome back,{" "}
                      <strong className="text-teal-700">{user?.name}</strong>!
                      <motion.span
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 1, delay: 1 }}
                        className="inline-block ml-1"
                      >
                        🩺
                      </motion.span>
                    </p>
                    <p className="text-sm text-slate-500 mt-1 font-medium">
                      Signed in as{" "}
                      <span className="uppercase tracking-wider text-teal-600 font-bold">
                        {user?.role}
                      </span>
                    </p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to={getDashboardRoute()}
                      className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-white font-bold text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                      style={{
                        background:
                          "linear-gradient(135deg, #00BBA7, #00968866)",
                        boxShadow: "0 8px 32px rgba(0, 187, 167, 0.35)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow =
                          "0 12px 40px rgba(0, 187, 167, 0.5)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow =
                          "0 8px 32px rgba(0, 187, 167, 0.35)";
                      }}
                    >
                      Go to Dashboard
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <ArrowRight className="h-5 w-5" />
                      </motion.span>
                    </Link>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  className="flex flex-col sm:flex-row justify-center gap-4"
                >
                  <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      asChild
                      className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white shadow-lg shadow-teal-600/20 px-8 h-14 text-base rounded-full group relative overflow-hidden"
                    >
                      <Link to={ROUTES.REGISTER}>
                        <span className="relative z-10 flex items-center">
                          Get Started Free
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </motion.div>
                        </span>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400"
                          initial={{ x: "100%" }}
                          whileHover={{ x: 0 }}
                          transition={{ duration: 0.3 }}
                        />
                      </Link>
                    </Button>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      asChild
                      className="h-14 px-8 text-base rounded-full border-2 border-slate-200 hover:border-teal-600 hover:text-teal-700 hover:bg-teal-50 transition-all"
                    >
                      <Link to={ROUTES.LOGIN}>Sign In</Link>
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:block"
            >
              <div className="w-6 h-10 border-2 border-slate-300 rounded-full flex justify-center">
                <motion.div
                  animate={{ y: [0, 15, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-2"
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-20 bg-white border-y border-slate-100">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="text-center group"
              >
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{ duration: 2, delay: index * 0.2 }}
                  className="inline-block"
                >
                  <stat.icon
                    className={`h-8 w-8 ${stat.color} mx-auto mb-3 group-hover:scale-110 transition-transform`}
                  />
                </motion.div>
                <div className="text-3xl font-black text-slate-900">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-500 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Grid with Hover Effects */}
      <section id="features" className="px-4 py-20 md:py-32 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring" }}
              className="inline-block px-4 py-1.5 rounded-full bg-teal-50 text-teal-700 text-sm font-bold uppercase tracking-wider"
            >
              Powerful Features
            </motion.span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Everything You Need to
              <span className="text-teal-600 block">Run a Modern Clinic</span>
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              Everything required to manage a modern clinic efficiently, packed
              into one seamless experience.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map(
              ({ icon: Icon, title, desc, color, gradient, stats }, index) => (
                <motion.div
                  key={title}
                  variants={itemVariants}
                  whileHover={{
                    y: -10,
                    transition: { type: "spring", stiffness: 300 },
                  }}
                  onHoverStart={() => setHoveredFeature(index)}
                  onHoverEnd={() => setHoveredFeature(null)}
                  className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition-all hover:shadow-xl hover:shadow-teal-900/10"
                >
                  {/* Animated background gradient */}
                  <motion.div
                    animate={{
                      scale: hoveredFeature === index ? 1.5 : 1,
                      opacity: hoveredFeature === index ? 0.2 : 0,
                    }}
                    className={`absolute inset-0 ${gradient}`}
                  />

                  <div className="space-y-6 relative z-10">
                    <motion.div
                      animate={{
                        rotate: hoveredFeature === index ? [0, -10, 10, 0] : 0,
                      }}
                      transition={{ duration: 0.5 }}
                      className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg relative overflow-hidden`}
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Icon className="h-7 w-7" />
                      </motion.div>
                    </motion.div>

                    <div className="space-y-3">
                      <h3 className="font-bold text-xl text-slate-900">
                        {title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed font-medium">
                        {desc}
                      </p>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{
                        opacity: hoveredFeature === index ? 1 : 0,
                        y: hoveredFeature === index ? 0 : 10,
                      }}
                      className="text-xs font-bold text-teal-600 uppercase tracking-wider flex items-center gap-1"
                    >
                      <Zap className="h-3 w-3" />
                      {stats}
                    </motion.div>
                  </div>

                  {/* Decorative corner */}
                  <motion.div
                    animate={{
                      opacity: hoveredFeature === index ? 1 : 0,
                      scale: hoveredFeature === index ? 1 : 0.5,
                    }}
                    className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-teal-500/10 to-transparent rounded-tl-3xl"
                  />
                </motion.div>
              ),
            )}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section with Cards */}
      <section
        id="benefits"
        className="px-4 py-20 md:py-32 bg-slate-50 border-y border-slate-100"
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-sm font-bold uppercase tracking-wider">
              Role-Based Experience
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Built For Everyone in Your
              <span className="text-indigo-600 block">
                Healthcare Ecosystem
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map(({ role, icon: Icon, items }, index) => (
              <motion.div
                key={role}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:border-teal-200 hover:shadow-xl transition-all group"
              >
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="inline-block"
                >
                  <Icon className="h-12 w-12 text-teal-600 mb-6 group-hover:scale-110 transition-transform" />
                </motion.div>

                <h3 className="font-bold text-2xl text-teal-700 mb-6 pb-4 border-b border-slate-100">
                  {role}
                </h3>

                <ul className="space-y-4">
                  {items.map((item, i) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + i * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-3 text-slate-700 font-medium group/item"
                    >
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ type: "spring" }}
                      >
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                      </motion.div>
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ x: 5 }}
                  className="mt-6 text-sm font-bold text-teal-600 flex items-center gap-1 group/btn"
                >
                  Learn more
                  <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="px-4 py-20 md:py-32 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-purple-50 text-purple-700 text-sm font-bold uppercase tracking-wider">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Trusted by Healthcare
              <span className="text-purple-600 block">
                Professionals Worldwide
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-teal-500/10 rounded-3xl blur-2xl" />
                <div className="relative bg-white rounded-3xl p-8 border border-slate-100 shadow-xl">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="text-6xl mb-4"
                  >
                    "
                  </motion.div>
                  <p className="text-slate-700 mb-6 leading-relaxed">
                    {testimonial.quote}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-slate-500">
                        {testimonial.role}
                      </div>
                      <div className="text-xs text-teal-600">
                        {testimonial.clinic}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 mt-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 + i * 0.1 }}
                        className="text-yellow-400"
                      >
                        ★
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Parallax */}
      <section className="px-4 py-20 md:py-32 bg-white">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-700 p-10 md:p-20 text-center shadow-2xl"
          >
            {/* Animated background elements */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
              }}
              transition={{ duration: 20, repeat: Infinity }}
              className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-2xl"
            />
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, -90, 0],
              }}
              transition={{ duration: 25, repeat: Infinity }}
              className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-black/10 blur-2xl"
            />

            {/* Floating medical icons */}
            <motion.div
              animate={{
                y: [0, -20, 0],
                x: [0, 20, 0],
              }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute top-10 left-10 text-white/10"
            >
              <Ambulance size={60} />
            </motion.div>

            <motion.div
              animate={{
                y: [0, 20, 0],
                x: [0, -20, 0],
              }}
              transition={{ duration: 7, repeat: Infinity }}
              className="absolute bottom-10 right-10 text-white/10"
            >
              <Brain size={60} />
            </motion.div>

            <div className="relative z-10 space-y-8">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="inline-block"
              >
                <Globe className="h-16 w-16 text-white/50 mx-auto" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl font-bold text-white tracking-tight"
              >
                Ready to Transform Your Clinic?
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-teal-50 text-xl max-w-2xl mx-auto opacity-90"
              >
                Join thousands of healthcare providers who've modernized their
                practice with ClinicOS. Start your 14-day free trial today.
              </motion.p>

              {!isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
                >
                  <Button
                    size="lg"
                    asChild
                    className="bg-white text-teal-800 hover:bg-slate-50 h-14 px-10 text-lg rounded-full shadow-xl group relative overflow-hidden"
                  >
                    <Link to={ROUTES.REGISTER}>
                      <span className="relative z-10 flex items-center">
                        Get Started Free
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </motion.div>
                      </span>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-teal-100 to-cyan-100"
                        initial={{ x: "100%" }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    </Link>
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
