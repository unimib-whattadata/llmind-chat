import React from "react";
import { cn } from "~/lib/utils";
import {
  ChatBubbleMessage,
  ChatBubble,
} from "~/app/components/main/chats/chat-bubble";
import { type MessageType } from "~/app/components/main/chats/types";
import Markdown from "react-markdown";
import { SkipMessage } from "~/app/components/main/chats/validation-chat/skip-message";

export type MessageProps = {
  total: number;
  index: number;
  blockId: number;
  message: MessageType;
  onClickSkip: (blockId: number, messageId: number) => void;
  isLoading?: boolean;
};

export const Message = (messageProps: MessageProps) => {
  const { total, blockId, index, onClickSkip, message, isLoading } =
    messageProps;
  return (
    <ChatBubble
      className={cn(
        message.messageType == "CLINICAL" ? "max-w-[100%]" : "",
        "flex-col",
      )}
      variant={message.role == "AI" ? "received" : "sent"}
    >
      <ChatBubbleMessage isLoading={isLoading}>
        {message.title && (
          <h1
            className={cn(
              "mb-2 text-sm font-bold text-forest-green-800",
              message.messageType == "CLINICAL" ? "bg-gray-60" : "",
            )}
          >
            {message.title} {index} on {total}
          </h1>
        )}
        <Markdown className="text-xs">{message.text}</Markdown>
      </ChatBubbleMessage>
      {message.hasSkip && (
        <SkipMessage
          messageId={message.id}
          blockId={blockId}
          onClickSkip={onClickSkip}
          className="self-start"
        />
      )}
    </ChatBubble>
  );
};

export default Message;
