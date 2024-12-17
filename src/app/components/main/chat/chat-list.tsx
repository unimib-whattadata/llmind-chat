"use client";
import React from "react";
import { cn } from "~/lib/utils";
import Message from "~/app/components/main/chat/message";
import { AnimatePresence, motion } from "framer-motion";
import { ChatMessageList } from "~/app/components/main/chat/chat-message-list";
import { type MessageType } from "~/app/components/main/chat/types";

export type ChatListProps = React.HTMLAttributes<HTMLDivElement> & {
  messages: MessageType[];
  isLoading: boolean;
};

export function ChatList(props: ChatListProps) {
  const { messages, isLoading, className } = props;
  return (
    <div
      className={cn(
        "flex h-[calc(100vh-55px)] w-full flex-col overflow-y-auto",
        className,
      )}
    >
      <ChatMessageList>
        <AnimatePresence>
          {messages.map((message, index) => {
            return (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
                animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
                transition={{
                  opacity: { duration: 0.1 },
                  layout: {
                    type: "spring",
                    bounce: 0.3,
                    duration: index * 0.05 + 0.2,
                  },
                }}
                style={{ originX: 0.5, originY: 0.5 }}
                className="flex flex-col gap-2 p-4 last:mb-4"
              >
                <Message
                  blockId={0}
                  onClickValidation={() => {
                    console.log("message on click");
                  }}
                  message={message}
                  isLoading={isLoading ?? false}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </ChatMessageList>
    </div>
  );
}
