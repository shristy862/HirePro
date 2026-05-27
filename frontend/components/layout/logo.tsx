import Link from "next/link";
import { Sparkles } from "lucide-react";
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
      <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25">
        <Sparkles className="size-4" aria-hidden />
      </div>
      {showText && (
        <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-indigo-400">
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
