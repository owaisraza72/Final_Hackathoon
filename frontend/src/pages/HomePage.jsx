import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { ROUTES } from "@/utils/constants";
import {
  Shield,
  Zap,
  Lock,
  Database,
  Gauge,
  Boxes,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: Shield,
      title: "Secure Authentication",
      desc: "JWT access & refresh tokens with HTTP-only cookies and CORS protection",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Lock,
      title: "RBAC & Ownership",
      desc: "Role-based access control with resource ownership protection",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Zap,
      title: "Production Ready",
      desc: "Docker, rate limiting, validation, and error handling at every layer",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Database,
      title: "MongoDB Integration",
      desc: "Mongoose ORM with optimized queries and data validation",
      color: "from-green-500 to-teal-500",
    },
    {
      icon: Gauge,
      title: "Performance",
      desc: "Optimized caching, pagination, and efficient API endpoints",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: Boxes,
      title: "Modular Architecture",
      desc: "Well-organized project structure for scalability",
      color: "from-indigo-500 to-blue-500",
    },
  ];

  const techStack = [
    { category: "Frontend", items: ["React 18", "Vite", "Redux Toolkit", "RTK Query"] },
    { category: "Backend", items: ["Node.js", "Express", "MongoDB", "Mongoose"] },
    { category: "Tools", items: ["Docker", "JWT", "Bcrypt", "Multer"] },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/30 px-4 py-12 md:py-32">
        <div className="container mx-auto max-w-6xl">
          {/* Background Elements */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute -right-40 -bottom-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
          </div>

          <div className="space-y-8 text-center">
            {/* Badge */}
            <div className="inline-block">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                Production Ready MERN Stack
              </span>
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-7xl font-bold tracking-tighter">
                Build Modern Apps{" "}
                <span className="bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
                  Faster
                </span>
              </h1>
              <p className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed">
                A production-ready MERN stack boilerplate with enterprise-grade
                authentication, role-based access control, and everything you need to
                launch your next project in days, not months.
              </p>
            </div>

            {/* CTA Buttons */}
            {isAuthenticated ? (
              <div className="space-y-4">
                <div className="inline-block rounded-lg border border-primary/20 bg-primary/5 px-6 py-4 text-center">
                  <p className="text-lg">
                    Welcome back, <strong className="text-primary">{user?.name}</strong>
                    ! 👋
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Role: <span className="font-semibold">{user?.role}</span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" asChild className="gap-2 px-8">
                  <Link to={ROUTES.REGISTER}>
                    Get Started <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to={ROUTES.LOGIN}>Sign In</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Enterprise Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need for production-grade applications
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur transition-all hover:border-primary/50 hover:bg-card hover:shadow-lg"
              >
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 -z-10 bg-gradient-to-br ${color} opacity-0 transition-opacity group-hover:opacity-5`}
                />

                <div className="p-6 space-y-4">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${color} text-white`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="px-4 py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Built With Modern Tech</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Leveraging the best tools and frameworks in the ecosystem
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {techStack.map(({ category, items }) => (
              <div
                key={category}
                className="rounded-xl border border-border/50 bg-card p-6 space-y-4"
              >
                <h3 className="font-semibold text-lg text-primary">{category}</h3>
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
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
      <section className="px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 p-8 md:p-12 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to get started?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Join developers building production-ready applications with our
              comprehensive boilerplate. Start in minutes, not months.
            </p>
            {!isAuthenticated && (
              <Button size="lg" asChild className="gap-2">
                <Link to={ROUTES.REGISTER}>
                  Create Your First Project <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;