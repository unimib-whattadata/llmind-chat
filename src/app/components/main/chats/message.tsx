import React from "react";
import { cn } from "~/lib/utils";
import {
  ChatBubbleMessage,
  ChatBubble,
} from "~/app/components/main/chats/chat-bubble";
import { MessageValidation } from "~/app/components/main/chats/validation-chat/message-validation";
import { type MessageType } from "~/app/components/main/chats/types";
import Markdown from "react-markdown";
import { SkipMessage } from "~/app/components/main/chats/validation-chat/skip-message";

export type MessageProps = {
  index: number;
  blockId: number;
  message: MessageType;
  onClickValidation: (
    blockId: number,
    messageId: number,
    textValidation: "Yes" | "No",
  ) => void;
  onClickSkip: (blockId: number, messageId: number) => void;
  isLoading?: boolean;
};

export const Message = (messageProps: MessageProps) => {
  const { blockId, index, onClickValidation, onClickSkip, message, isLoading } =
    messageProps;
  return (
    <ChatBubble
      className="flex-col"
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
            {message.title} {index}
          </h1>
        )}
        <Markdown className="text-xs">{message.text}</Markdown>
      </ChatBubbleMessage>
      {message.hasValidation && (
        <MessageValidation
          messageId={message.id}
          blockId={blockId}
          onClickValidation={onClickValidation}
          className="self-start"
        />
      )}
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
