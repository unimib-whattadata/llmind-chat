import { SkipForward } from "lucide-react";
import { cn } from "~/lib/utils";
import { ValidationButton } from "~/app/components/main/chats/validation-chat/buttons/validation-button";

type MessageValidationType = React.HTMLAttributes<HTMLDivElement> & {
  messageId: number;
  blockId: number;
  onClickSkip: (blockId: number, messageId: number) => void;
};

export const SkipMessage = (props: MessageValidationType) => {
  const { blockId, messageId, className, onClickSkip } = props;
  return (
    <div className={cn("flex flex-row gap-2", className)}>
      <ValidationButton
        onClick={() => onClickSkip(blockId, messageId)}
        text="Skip"
        icon={SkipForward}
      />
    </div>
  );
};
