import { ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "~/lib/utils";
import { ValidationButton } from "~/app/components/main/chats/validation-chat/validation-button";

type MessageValidationType = React.HTMLAttributes<HTMLDivElement> & {
  messageId: number;
  blockId: number;
  onClickValidation: (
    blockId: number,
    messageId: number,
    textValidation: "Yes" | "No",
  ) => void;
};

export const MessageValidation = (props: MessageValidationType) => {
  const { blockId, messageId, className, onClickValidation } = props;
  return (
    <div className={cn("flex flex-row gap-2", className)}>
      <ValidationButton
        onClick={() => onClickValidation(blockId, messageId, "Yes")}
        text="Yes"
        icon={ThumbsUp}
      />
      <ValidationButton
        onClick={() => onClickValidation(blockId, messageId, "No")}
        text="No"
        icon={ThumbsDown}
      />
    </div>
  );
};
