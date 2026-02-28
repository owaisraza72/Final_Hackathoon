import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ROUTES } from "@/utils/constants";
import {
  CheckCircle2,
  Code2,
  Database,
  Lock,
  Zap,
  Users,
  GitBranch,
  Rocket,
  ArrowRight,
} from "lucide-react";

const AboutPage = () => {
  const technologies = [
    { name: "React 18", desc: "Modern UI library with hooks" },
    { name: "Vite", desc: "Next-gen build tool for speed" },
    { name: "Redux Toolkit", desc: "State management simplified" },
    { name: "RTK Query", desc: "Powerful data fetching" },
    { name: "Tailwind CSS", desc: "Utility-first styling" },
    { name: "Node.js", desc: "JavaScript backend runtime" },
    { name: "Express", desc: "Minimal web framework" },
    { name: "MongoDB", desc: "NoSQL document database" },
    { name: "Mongoose", desc: "ODM for MongoDB" },
    { name: "JWT", desc: "Secure authentication" },
    { name: "Bcrypt", desc: "Password hashing" },
    { name: "Docker", desc: "Container platform" },
  ];

  const features = [
    {
      icon: Lock,
      title: "Enterprise Security",
      desc: "JWT tokens, HTTP-only cookies, CORS, rate limiting, and input validation",
    },
    {
      icon: Users,
      title: "Role-Based Access",
      desc: "Complete RBAC system with ownership protection and fine-grained permissions",
    },
    {
      icon: Database,
      title: "Optimized Database",
      desc: "MongoDB with Mongoose, optimized queries, and proper indexing",
    },
    {
      icon: Zap,
      title: "Performance First",
      desc: "Pagination, caching strategies, and optimized API responses",
    },
    {
      icon: Code2,
      title: "Clean Architecture",
      desc: "Separated concerns with controllers, services, and middleware patterns",
    },
    {
      icon: GitBranch,
      title: "Version Control",
      desc: "Git-ready with proper .gitignore and conventional commits structure",
    },
  ];

  const values = [
    {
      title: "Quality",
      desc: "We prioritize code quality, security, and performance in every aspect.",
    },
    {
      title: "Developer Experience",
      desc: "Easy to understand, extend, and maintain with clear documentation.",
    },
    {
      title: "Best Practices",
      desc: "Following industry standards and modern development patterns.",
    },
    {
      title: "Scalability",
      desc: "Built to scale from MVP to enterprise-grade applications.",
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/30 px-4 py-12 md:py-24">
        <div className="container mx-auto max-w-4xl">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute -right-40 -bottom-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
          </div>

          <div className="space-y-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold">About MERN Boilerplate</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A comprehensive, production-ready MERN stack boilerplate designed to
              accelerate your development process and ensure best practices from
              day one.
            </p>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">What We Offer</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to build secure, scalable, and modern applications
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur p-6 transition-all hover:border-primary/50 hover:bg-card hover:shadow-lg"
              >
                <div className="space-y-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
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
            <h2 className="text-3xl md:text-4xl font-bold">Technology Stack</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built with the latest and most reliable tools in the industry
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {technologies.map(({ name, desc }) => (
              <div
                key={name}
                className="rounded-lg border border-border/50 bg-card p-4 flex items-start gap-3 hover:border-primary/50 transition-colors"
              >
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="font-medium text-sm">{name}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Principles that guide every decision we make
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map(({ title, desc }) => (
              <div key={title} className="space-y-4">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Statistics */}
      <section className="px-4 py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <p className="text-4xl md:text-5xl font-bold text-primary">100%</p>
              <p className="text-muted-foreground">Production Ready</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl md:text-5xl font-bold text-primary">12+</p>
              <p className="text-muted-foreground">Tech Tools</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl md:text-5xl font-bold text-primary">6</p>
              <p className="text-muted-foreground">Core Features</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl md:text-5xl font-bold text-primary">∞</p>
              <p className="text-muted-foreground">Possibilities</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 p-8 md:p-12 text-center space-y-6">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
              <Rocket className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold">Ready to Build?</h2>
              <p className="text-muted-foreground text-lg">
                Start building your next project with our comprehensive boilerplate
              </p>
            </div>
            <Button size="lg" asChild className="gap-2">
              <Link to={ROUTES.HOME}>
                Get Started Now <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;