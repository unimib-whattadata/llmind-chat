import { Button } from "~/app/components/ui/button";
import { type LucideIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import React from "react";

type ValidationButtonType = React.HTMLAttributes<HTMLButtonElement> & {
  text: string;
  icon: LucideIcon;
};

export const ValidationButton = (props: ValidationButtonType) => {
  const { text, className, onClick } = props;
  return (
    <Button
      onClick={onClick}
      size="sm"
      className={cn(
        "hover:bg-forest-green-400 focus:bg-forest-green-400 flex max-h-7 items-center bg-gray-50",
        className,
      )}
    >
      <props.icon className="text-black" size={14} />
      <span className="text-xs text-black">{text}</span>
    </Button>
  );
};
