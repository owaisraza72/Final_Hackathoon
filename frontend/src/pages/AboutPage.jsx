import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ROUTES } from "@/utils/constants";
import {
  CircleCheckBig,
  Code2,
  Database,
  Lock,
  Zap,
  Users,
  GitBranch,
  Rocket,
  ArrowRight,
  HeartPulse,
  Stethoscope,
  Activity,
  Shield,
  Sparkles,
  Award,
  Microscope,
  Brain,
  Clock,
  Globe,
  Target,
  TrendingUp,
  FileHeart,
  UserRound,
  CalendarCheck,
  Bot,
  Scan,
  Fingerprint,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const AboutPage = () => {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const technologies = [
    {
      name: "React 18",
      desc: "Modern healthcare UI components",
      icon: HeartPulse,
    },
    { name: "Vite", desc: "Lightning-fast development", icon: Zap },
    {
      name: "Redux Toolkit",
      desc: "Centralized patient data state",
      icon: Database,
    },
    {
      name: "RTK Query",
      desc: "Real-time medical data fetching",
      icon: Activity,
    },
    {
      name: "Tailwind CSS",
      desc: "Responsive clinical interfaces",
      icon: Code2,
    },
    { name: "Node.js", desc: "HIPAA-compliant backend", icon: Shield },
    { name: "Express", desc: "Secure API architecture", icon: GitBranch },
    { name: "MongoDB", desc: "Patient records database", icon: Database },
    { name: "Mongoose", desc: "Medical data modeling", icon: FileHeart },
    { name: "JWT", desc: "Secure practitioner access", icon: Lock },
    { name: "Bcrypt", desc: "Patient data encryption", icon: Fingerprint },
    { name: "Docker", desc: "Scalable deployment", icon: Globe },
  ];

  const features = [
    {
      icon: Shield,
      title: "HIPAA-Compliant Security",
      desc: "Enterprise-grade encryption, JWT tokens, HTTP-only cookies, and strict access controls for patient data protection",
      color: "from-teal-500 to-emerald-500",
      gradient: "from-teal-50 to-emerald-50",
    },
    {
      icon: Users,
      title: "Multi-Role Portal",
      desc: "Complete RBAC system with dedicated portals for Doctors, Patients, Receptionists, and Administrators",
      color: "from-indigo-500 to-purple-500",
      gradient: "from-indigo-50 to-purple-50",
    },
    {
      icon: Database,
      title: "Medical Records Management",
      desc: "Secure MongoDB database with optimized queries for fast patient record retrieval and storage",
      color: "from-blue-500 to-cyan-500",
      gradient: "from-blue-50 to-cyan-50",
    },
    {
      icon: Bot,
      title: "Gemini AI Integration",
      desc: "AI-powered diagnosis suggestions and medical explanations using Google's advanced language models",
      color: "from-orange-500 to-red-500",
      gradient: "from-orange-50 to-red-50",
    },
    {
      icon: CalendarCheck,
      title: "Smart Scheduling",
      desc: "Automated appointment booking with real-time availability and intelligent reminders",
      color: "from-purple-500 to-pink-500",
      gradient: "from-purple-50 to-pink-50",
    },
    {
      icon: Activity,
      title: "Live Analytics",
      desc: "Interactive dashboards with real-time patient flow, revenue tracking, and clinical insights",
      color: "from-amber-500 to-orange-500",
      gradient: "from-amber-50 to-orange-50",
    },
  ];

  const values = [
    {
      icon: Shield,
      title: "Patient Privacy First",
      desc: "We prioritize data security and confidentiality with HIPAA-compliant architecture.",
      color: "text-teal-600",
      bg: "bg-teal-100",
    },
    {
      icon: Stethoscope,
      title: "Clinical Excellence",
      desc: "Built by healthcare professionals for accurate medical workflows and best practices.",
      color: "text-indigo-600",
      bg: "bg-indigo-100",
    },
    {
      icon: Users,
      title: "Accessible Care",
      desc: "Making healthcare accessible through intuitive interfaces for all user roles.",
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      icon: Rocket,
      title: "Continuous Innovation",
      desc: "Regular updates with cutting-edge medical technology and user feedback.",
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
  ];

  const stats = [
    {
      value: "10,000+",
      label: "Active Patients",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
    },
    {
      value: "500+",
      label: "Healthcare Providers",
      icon: Stethoscope,
      color: "from-teal-500 to-emerald-500",
    },
    {
      value: "50K+",
      label: "Appointments Booked",
      icon: CalendarCheck,
      color: "from-purple-500 to-pink-500",
    },
    {
      value: "99.9%",
      label: "System Uptime",
      icon: Activity,
      color: "from-amber-500 to-orange-500",
    },
  ];

  const teamValues = [
    {
      icon: Brain,
      title: "Innovation",
      desc: "Pushing boundaries in healthcare technology",
    },
    {
      icon: HeartPulse,
      title: "Compassion",
      desc: "Putting patient care at the center of everything",
    },
    {
      icon: Target,
      title: "Precision",
      desc: "Accuracy in every medical transaction",
    },
    {
      icon: TrendingUp,
      title: "Growth",
      desc: "Continuously improving healthcare delivery",
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
    <div className="w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-teal-50/30 px-4 py-20 md:py-32">
        {/* Animated Medical Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
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
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute -right-40 -bottom-40 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl"
          />

          {/* Floating medical icons */}
          <motion.div
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-20 right-20 text-teal-500/10"
          >
            <HeartPulse size={120} />
          </motion.div>

          <motion.div
            animate={{
              y: [0, 30, 0],
              x: [0, -20, 0],
              rotate: [0, -10, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute bottom-20 left-20 text-indigo-500/10"
          >
            <Stethoscope size={120} />
          </motion.div>

          {/* Medical cross pattern */}
          <div className="absolute inset-0 opacity-[0.02]">
            <div className="absolute top-40 left-40 text-8xl">⚕️</div>
            <div className="absolute bottom-40 right-40 text-8xl">🏥</div>
          </div>
        </div>

        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8 text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="inline-block"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm border border-teal-200 px-4 py-2 text-sm font-semibold text-teal-700 shadow-lg">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                </span>
                <Scan className="h-4 w-4" />
                About ClinicOS
                <Scan className="h-4 w-4" />
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight"
            >
              Modernizing{" "}
              <span className="bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent">
                Healthcare
              </span>{" "}
              Through Technology
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
            >
              A comprehensive, production-ready healthcare platform designed to
              streamline clinic operations, enhance patient care, and ensure
              HIPAA compliance from day one.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-4 pt-4"
            >
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Shield className="h-4 w-4 text-teal-500" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Award className="h-4 w-4 text-indigo-500" />
                <span>Enterprise Ready</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>AI-Powered</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-16 bg-white border-y border-slate-100">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.05 }}
                className="text-center group"
              >
                <div
                  className={`inline-flex h-12 w-12 mb-3 rounded-xl bg-gradient-to-r ${stat.color} text-white items-center justify-center shadow-lg group-hover:shadow-xl transition-all`}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
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

      {/* Core Features */}
      <section className="px-4 py-20 md:py-28">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Built for{" "}
              <span className="bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent">
                Modern Clinics
              </span>
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Everything you need to manage a healthcare practice efficiently
              and securely
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(
              ({ icon: Icon, title, desc, color, gradient }, index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  onHoverStart={() => setHoveredFeature(index)}
                  onHoverEnd={() => setHoveredFeature(null)}
                  className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-lg transition-all hover:shadow-2xl hover:shadow-teal-900/10"
                >
                  {/* Animated background */}
                  <motion.div
                    animate={{
                      scale: hoveredFeature === index ? 1.5 : 1,
                      opacity: hoveredFeature === index ? 0.1 : 0,
                    }}
                    className={`absolute inset-0 bg-gradient-to-br ${gradient}`}
                  />

                  <div className="space-y-4 relative z-10">
                    <motion.div
                      animate={{
                        rotate: hoveredFeature === index ? [0, -10, 10, 0] : 0,
                      }}
                      transition={{ duration: 0.5 }}
                      className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r ${color} text-white shadow-lg`}
                    >
                      <Icon className="h-7 w-7" />
                    </motion.div>

                    <h3 className="font-bold text-xl text-slate-900">
                      {title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">{desc}</p>
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
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      {/* <section className="px-4 py-20 md:py-28 bg-gradient-to-br from-slate-50 to-indigo-50/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Powered by{" "}
              <span className="bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent">
                Modern Technology
              </span>
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Built with the most reliable and secure tools in the industry
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {technologies.map(({ name, desc, icon: Icon }, index) => (
              <motion.div
                key={name}
                variants={itemVariants}
                custom={index}
                whileHover={{ x: 5, scale: 1.02 }}
                className="group rounded-2xl border border-slate-200 bg-white p-5 flex items-start gap-4 hover:border-teal-300 hover:shadow-xl transition-all"
              >
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-500 to-indigo-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900">{name}</p>
                  <p className="text-xs text-slate-500 mt-1">{desc}</p>
                </div>
                <CircleCheckBig className="h-5 w-5 text-green-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section> */}

      {/* Core Values */}
      <section className="px-4 py-20 md:py-28">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Our{" "}
              <span className="bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent">
                Core Values
              </span>
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Principles that guide every decision in our healthcare platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc, color, bg }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl border border-slate-100 p-6 shadow-lg hover:shadow-xl transition-all text-center"
              >
                <div
                  className={`h-14 w-14 ${bg} rounded-xl flex items-center justify-center mx-auto mb-4`}
                >
                  <Icon className={`h-7 w-7 ${color}`} />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">
                  {title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Values */}
      <section className="px-4 py-16 bg-gradient-to-br from-teal-600 to-indigo-600 text-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                Built by Healthcare Professionals
              </h2>
              <p className="text-teal-100 text-lg leading-relaxed">
                Our team combines deep medical expertise with cutting-edge
                technology to create a platform that truly understands the needs
                of modern healthcare.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                {teamValues.map(({ icon: Icon, title }) => (
                  <div
                    key={title}
                    className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { number: "10+", label: "Years Healthcare Experience" },
                { number: "50+", label: "Medical Professionals" },
                { number: "100+", label: "Clinics Served" },
                { number: "24/7", label: "Support Available" },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center"
                >
                  <div className="text-3xl font-black mb-1">{item.number}</div>
                  <div className="text-xs font-medium uppercase tracking-wider text-teal-100">
                    {item.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 md:py-28">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-teal-600 to-indigo-600 p-10 md:p-16 text-center shadow-2xl"
          >
            {/* Animated background */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"
            />

            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, -90, 0],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear",
                delay: 1,
              }}
              className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-black/10 blur-3xl"
            />

            <div className="relative z-10 space-y-8">
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm text-white"
              >
                <Rocket className="h-8 w-8" />
              </motion.div>

              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                Ready to Transform Your Clinic?
              </h2>

              <p className="text-teal-50 text-lg max-w-2xl mx-auto opacity-90">
                Join thousands of healthcare providers who've modernized their
                practice with ClinicOS. Start your 14-day free trial today.
              </p>

              <Button
                size="lg"
                asChild
                className="bg-white text-teal-800 hover:bg-slate-50 h-14 px-10 text-lg rounded-full shadow-xl hover:scale-105 transition-transform"
              >
                <Link to={ROUTES.REGISTER} className="flex items-center gap-2">
                  Get Started Now
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              <div className="flex justify-center gap-6 pt-4">
                <span className="text-teal-100 text-sm flex items-center gap-1">
                  <Shield className="h-4 w-4" />
                  HIPAA Compliant
                </span>
                <span className="text-teal-100 text-sm flex items-center gap-1">
                  <Lock className="h-4 w-4" />
                  Encrypted
                </span>
                <span className="text-teal-100 text-sm flex items-center gap-1">
                  <Award className="h-4 w-4" />
                  Enterprise Ready
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

