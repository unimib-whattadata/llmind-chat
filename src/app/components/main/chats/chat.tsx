import { cn } from "~/lib/utils";
import { useRef, useState } from "react";

type ChatProps = React.HTMLAttributes<HTMLDivElement> & {
  title: string;
};

export const Chat = (props: ChatProps) => {
  const { title, className, children } = props;

  return (
    <div
      className={cn(
        "relative flex h-[calc(100vh-55px)] w-full flex-col overflow-hidden bg-gray-10",
        className,
      )}
    >
      <h1 className="mb-4 overflow-hidden p-4 align-top font-bold text-forest-green-700">
        {title}
      </h1>
      {children}
    </div>
  );
};
