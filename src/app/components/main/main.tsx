"use client";
import { useSidebar } from "~/app/components/ui/sidebar";
import { ValidationChat } from "~/app/components/main/chat/validation-chat/validation-chat";
import { cn } from "~/lib/utils";

type MainType = React.HTMLAttributes<HTMLDivElement> & {};

export const Main = (props: MainType) => {
  const { className } = props;
  const { validation } = useSidebar();

  return (
    <div
      className={cn(
        "bg-gray-10 relative flex h-[calc(100vh-55px)] w-full flex-col overflow-hidden",
        className,
      )}
    >
      {validation && <ValidationChat title="Clinical Cases" />}
    </div>
  );
};
