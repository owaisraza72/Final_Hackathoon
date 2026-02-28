import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
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
} from "lucide-react";

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

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
      desc: "Generate, manage, and download PDF prescriptions seamlessly.",
      color: "from-teal-500 to-emerald-500",
    },
    {
      icon: Bot,
      title: "Gemini AI Assistant",
      desc: "Smart AI-powered diagnosis suggestions and medical explanations.",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: CalendarCheck,
      title: "Smart Scheduling",
      desc: "Effortless appointment booking and daily schedule management.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: ShieldCheck,
      title: "Secure Access",
      desc: "Role-Based Access Control (RBAC) ensuring data privacy.",
      color: "from-slate-600 to-slate-800",
    },
    {
      icon: Activity,
      title: "Live Analytics",
      desc: "Interactive Recharts dashboards for admins and doctors.",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: UserRound,
      title: "Multi-Role Portal",
      desc: "Dedicated workspaces for Admins, Doctors, Receptionists & Patients.",
      color: "from-pink-500 to-rose-500",
    },
  ];

  const benefits = [
    {
      role: "For Doctors",
      items: [
        "AI Diagnosis Support",
        "Patient History Access",
        "Digital Prescriptions",
      ],
    },
    {
      role: "For Patients",
      items: [
        "Easy Appointment Booking",
        "Downloadable PDFs",
        "AI Medical Explanations",
      ],
    },
    {
      role: "For Clinics",
      items: [
        "Centralized Management",
        "Revenue Analytics",
        "Free / PRO SaaS Plans",
      ],
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-teal-50 px-4 py-16 md:py-32">
        <div className="container mx-auto max-w-6xl relative z-10">
          {/* Background Elements */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl animate-pulse" />
            <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
          </div>

          <div className="space-y-8 text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-block animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700 shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
                </span>
                SaaS Clinic Management Platform
              </span>
            </div>

            {/* Heading */}
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900">
                Modernize Your Clinic with{" "}
                <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  ClinicOS
                </span>
              </h1>
              <p className="mx-auto max-w-2xl text-lg md:text-xl text-slate-600 leading-relaxed font-medium">
                The all-in-one scalable platform digitizing clinic operations.
                From smart AI diagnosis to seamless appointment booking, built
                for modern healthcare.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="pt-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              {isAuthenticated ? (
                <div className="space-y-6 flex flex-col items-center">
                  <div className="inline-block rounded-2xl border border-teal-100 bg-white/60 backdrop-blur-md px-8 py-5 shadow-sm text-center">
                    <p className="text-lg text-slate-700">
                      Welcome back,{" "}
                      <strong className="text-teal-700">{user?.name}</strong>!
                      🩺
                    </p>
                    <p className="text-sm text-slate-500 mt-1 font-medium">
                      Signed in as{" "}
                      <span className="uppercase tracking-wider text-teal-600 font-bold">
                        {user?.role}
                      </span>
                    </p>
                  </div>
                  <Button
                    size="lg"
                    asChild
                    className="bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/20 px-8 h-12 text-base rounded-full"
                  >
                    <Link to={getDashboardRoute()}>
                      Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button
                    size="lg"
                    asChild
                    className="bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/20 px-8 h-14 text-base rounded-full transition-all hover:scale-105"
                  >
                    <Link to={ROUTES.REGISTER}>
                      Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="h-14 px-8 text-base rounded-full border-2 border-slate-200 hover:border-teal-600 hover:text-teal-700 hover:bg-teal-50 transition-all"
                  >
                    <Link to={ROUTES.LOGIN}>Sign In</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-20 md:py-32 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Powerful Features
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              Everything required to manage a modern clinic efficiently, packed
              into one seamless experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition-all hover:shadow-xl hover:shadow-teal-900/5 hover:-translate-y-1"
              >
                <div className="space-y-6">
                  <div
                    className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${color} text-white shadow-inner`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-bold text-xl text-slate-900">
                      {title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed font-medium">
                      {desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-4 py-20 md:py-32 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Built For Everyone
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              Tailored experiences for every role within your healthcare
              ecosystem.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map(({ role, items }) => (
              <div
                key={role}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:border-teal-200 transition-colors"
              >
                <h3 className="font-bold text-2xl text-teal-700 mb-6 pb-4 border-b border-slate-100">
                  {role}
                </h3>
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-slate-700 font-medium"
                    >
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 md:py-32 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-teal-600 to-cyan-700 p-10 md:p-20 text-center shadow-2xl">
            {/* Decorative circles */}
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-black/10 blur-2xl" />

            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                Upgrade Your Clinic Today
              </h2>
              <p className="text-teal-50 text-xl max-w-2xl mx-auto opacity-90">
                Join our scalable SaaS platform. Improve efficiency and provide
                intelligent AI assistance to your staff and patients.
              </p>
              {!isAuthenticated && (
                <Button
                  size="lg"
                  asChild
                  className="bg-white text-teal-800 hover:bg-slate-50 h-14 px-10 text-lg rounded-full shadow-xl transition-transform hover:scale-105"
                >
                  <Link to={ROUTES.REGISTER}>
                    Register Your Clinic Now{" "}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
