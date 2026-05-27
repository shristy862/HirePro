import Link from "next/link";
import { BriefcaseBusiness, Check } from "lucide-react";
import { APP_NAME } from "@/constants/navigation";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  /** Set false when Logo is placed inside another link/button */
  asLink?: boolean;
  href?: string;
}

export function Logo({
  className,
  showText = true,
  asLink = true,
  href = "/",
}: LogoProps) {
  const content = (
    <>
      <div className="relative flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25">
        <BriefcaseBusiness className="size-4" aria-hidden />
        <span className="absolute -bottom-1 -right-1 flex size-3.5 items-center justify-center rounded-full border border-background bg-emerald-500 text-[9px] text-white">
          <Check className="size-2.5" aria-hidden />
        </span>
      </div>
      {showText && (
        <span className="bg-gradient-to-r from-violet-700 to-indigo-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-indigo-400">
          {APP_NAME}
        </span>
      )}
    </>
  );

  const styles = cn(
    "flex cursor-pointer items-center gap-2 font-semibold tracking-tight",
    className
  );

  if (!asLink) {
    return <div className={styles}>{content}</div>;
  }

  return (
    <Link href={href} className={styles}>
      {content}
    </Link>
  );
}
