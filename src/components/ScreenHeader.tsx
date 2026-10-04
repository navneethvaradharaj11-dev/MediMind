import { cn } from "@/lib/utils";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const ScreenHeader = ({ title, subtitle, className }: ScreenHeaderProps) => (
  <div className={cn("mx-auto w-full max-w-xl md:max-w-5xl lg:max-w-6xl px-5 pt-4 pb-3 sm:px-6 md:px-8 md:pt-6 md:pb-4", className)}>
    <h1 className="break-words text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">{title}</h1>
    {subtitle && <p className="mt-1 text-sm md:text-base leading-6 text-muted-foreground">{subtitle}</p>}
  </div>
);

export default ScreenHeader;
