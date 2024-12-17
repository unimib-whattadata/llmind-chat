import { cn } from "~/lib/utils";
import { MicareLogo } from "~/app/components/logo";
export type HeaderProps = React.HTMLAttributes<HTMLDivElement> & {};

export const Header = (props: HeaderProps) => {
  const { className } = props;
  return (
    <header
      className={cn(
        "bg-forest-green-700 flex h-16 shrink-0 items-center gap-4 border-b px-4",
        className,
      )}
    >
      <MicareLogo />
      <h1 className="text-base font-bold text-white">LLMind Chat Validator</h1>
    </header>
  );
};
