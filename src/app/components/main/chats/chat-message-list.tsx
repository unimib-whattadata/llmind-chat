import * as React from "react";
import { cn } from "~/lib/utils";

type ChatMessageListProps = React.HTMLAttributes<HTMLDivElement> & {};

const ChatMessageList = React.forwardRef<HTMLDivElement, ChatMessageListProps>(
  ({ className, children, ...props }, ref) => (
    <div
      className={cn("flex h-full w-full flex-col", className)}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  ),
);

ChatMessageList.displayName = "ChatMessageList";

export { ChatMessageList };
