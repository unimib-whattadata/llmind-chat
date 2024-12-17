import React from "react";
import { cn } from "~/lib/utils";
import {
  ChatBubbleMessage,
  ChatBubble,
} from "~/app/components/main/chat/chat-bubble";
import { MessageValidation } from "~/app/components/main/chat/validation-chat/message-validation";
import { type MessageType } from "~/app/components/main/chat/types";

export type MessageProps = {
  blockId: number;
  message: MessageType;
  onClickValidation: (
    blockId: number,
    messageId: number,
    textValidation: "Yes" | "No",
  ) => void;
  isLoading?: boolean;
};

export const Message = (messageProps: MessageProps) => {
  const { blockId, onClickValidation, message, isLoading } = messageProps;
  return (
    <ChatBubble
      className="flex-col"
      variant={message.role == "AI" ? "received" : "sent"}
    >
      <ChatBubbleMessage isLoading={isLoading}>
        {message.title && (
          <h1
            className={cn(
              "text-forest-green-800 mb-2 text-sm font-bold",
              message.messageType == "CLINICAL" ? "bg-gray-60" : "",
            )}
          >
            {message.title}
          </h1>
        )}
        <p className="text-xs">{message.text}</p>
      </ChatBubbleMessage>
      {message.hasValidation && (
        <MessageValidation
          messageId={message.id}
          blockId={blockId}
          onClickValidation={onClickValidation}
          className="self-start"
        />
      )}
    </ChatBubble>
  );
};

export default Message;
