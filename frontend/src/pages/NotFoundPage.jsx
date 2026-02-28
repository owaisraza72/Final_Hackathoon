import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/utils/constants";
import { Home, ArrowLeft, Zap } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-[calc(100vh-8rem)] w-full flex items-center justify-center px-4 py-8 bg-gradient-to-br from-background via-background to-muted/30">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -right-40 -bottom-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="max-w-md w-full text-center space-y-8">
        {/* Animated 404 */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="h-8 w-8 text-primary animate-bounce" />
            <span className="text-7xl md:text-8xl font-bold bg-gradient-to-br from-primary via-primary to-primary/70 bg-clip-text text-transparent">
              404
            </span>
            <Zap className="h-8 w-8 text-primary animate-bounce" style={{ animationDelay: "0.2s" }} />
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold">
              Page Not Found
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Oops! The page you're looking for doesn't exist or has been moved. 
              Don't worry, let's get you back on track.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" asChild className="gap-2">
            <Link to={ROUTES.HOME}>
              <Home className="h-5 w-5" />
              Go Home
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="gap-2">
            <a href="javascript:history.back()">
              <ArrowLeft className="h-5 w-5" />
              Go Back
            </a>
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="rounded-lg border border-border/50 bg-card/50 backdrop-blur p-6 space-y-4">
          <p className="text-sm font-medium text-foreground">
            Useful Links
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Link
              to={ROUTES.HOME}
              className="text-xs text-primary hover:underline transition-colors"
            >
              Home
            </Link>
            <Link
              to={ROUTES.ABOUT}
              className="text-xs text-primary hover:underline transition-colors"
            >
              About
            </Link>
            <Link
              to={ROUTES.CONTACT}
              className="text-xs text-primary hover:underline transition-colors"
            >
              Contact
            </Link>
            <Link
              to={ROUTES.LOGIN}
              className="text-xs text-primary hover:underline transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Error Code */}
        <div className="pt-4 border-t border-border/40">
          <p className="text-xs text-muted-foreground">
            Error Code: <code className="font-mono bg-muted px-2 py-1 rounded">404 NOT_FOUND</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;