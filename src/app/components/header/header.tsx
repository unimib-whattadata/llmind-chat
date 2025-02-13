"use client";
import { cn } from "~/lib/utils";
import { MicareLogo } from "~/app/components/logo";
export type HeaderProps = React.HTMLAttributes<HTMLDivElement> & {};
import { useSidebar } from "../ui/sidebar";

export const Header = (props: HeaderProps) => {
  const { className } = props;
  const { mainContent } = useSidebar();
  return (
    <header
      className={cn(
        "flex h-16 shrink-0 items-center gap-2 border-b bg-forest-green-700 px-4",
        className,
      )}
    >
      <MicareLogo />
      <h1 className="text-base font-bold text-white">
        {mainContent.validation ? "Chat Validator" : "LLMind"}
      </h1>
    </header>
  );
};
