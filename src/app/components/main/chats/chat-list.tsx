"use client";
import React from "react";
import { cn } from "~/lib/utils";
import Message from "~/app/components/main/chats/message";
import { AnimatePresence, motion } from "framer-motion";
import { ChatMessageList } from "~/app/components/main/chats/chat-message-list";
import { type MessageType } from "~/app/components/main/chats/types";
import { type RefObject } from "react";

export type ChatListProps = React.HTMLAttributes<HTMLDivElement> & {
  messages: MessageType[];
  isLoading: boolean;
  ref: RefObject<HTMLDivElement>;
  tmpMessageUser: string;
};

export function ChatList(props: ChatListProps) {
  const { messages, ref, tmpMessageUser, isLoading, className } = props;
  return (
    <div
      className={cn(
        "flex h-[calc(100vh-55px)] w-full flex-col overflow-y-auto",
        className,
      )}
    >
      {messages.length == 0 && (
        <p className="self-center text-base text-gray-20">Empty Chat</p>
      )}
      <ChatMessageList ref={ref}>
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
                  total={0}
                  index={index}
                  blockId={0}
                  onClickValidation={() => {}}
                  onClickSkip={() => {}}
                  message={message}
                />
                {isLoading && index == messages.length - 1 && (
                  <Message
                    total={0}
                    index={index}
                    blockId={0}
                    onClickValidation={() => {}}
                    onClickSkip={() => {}}
                    message={{
                      messageType: "DEFAULT",
                      title: "",
                      id: 0,
                      text: tmpMessageUser,
                      timestamp: new Date(),
                      role: "USER",
                      hasValidation: false,
                      chatId: 0,
                      hasSkip: false,
                      diagnosisBlock: 0,
                      orderNumber: 0,
                    }}
                  />
                )}
                {isLoading && index == messages.length - 1 && (
                  <Message
                    total={0}
                    index={0}
                    blockId={index}
                    isLoading={true}
                    message={{
                      messageType: "DEFAULT",
                      title: "",
                      id: 0,
                      text: "",
                      timestamp: new Date(),
                      role: "AI",
                      hasValidation: false,
                      chatId: 0,
                      hasSkip: false,
                      diagnosisBlock: 0,
                      orderNumber: 0,
                    }}
                    onClickValidation={() => {}}
                    onClickSkip={() => {}}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={ref}></div>
      </ChatMessageList>
    </div>
  );
}
