import { Logo } from "@/components/layout/logo";
import { GuestGuard } from "@/components/auth/guest-guard";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GuestGuard>
      <div className="flex min-h-screen">
        <div className="relative hidden w-1/2 flex-col justify-between bg-gradient-to-br from-violet-600 via-indigo-600 to-violet-800 p-12 text-white lg:flex">
          <Logo className="text-white [&_span]:text-white [&_span]:bg-none" />
          <div>
            <blockquote className="text-2xl font-medium leading-relaxed">
              &ldquo;HireFlow cut our time-to-hire by 40%. The AI matching is
              eerily accurate.&rdquo;
            </blockquote>
            <p className="mt-4 text-violet-200">
              — Sarah Chen, VP Talent @ NovaTech
            </p>
          </div>
          <p className="text-sm text-violet-200">
            Trusted by 500+ growing teams worldwide
          </p>
        </div>
        <div className="flex flex-1 flex-col">
          <div className="flex items-center justify-between p-4 lg:justify-end">
            <div className="lg:hidden">
              <Logo />
            </div>
            <ThemeToggle />
          </div>
          <div className="flex flex-1 items-center justify-center px-4 pb-12">
            <div className="w-full max-w-md">{children}</div>
          </div>
        </div>
      </div>
    </GuestGuard>
  );
}
