import { AnimatePresence, motion } from "framer-motion";
import Message from "~/app/components/main/chats/message";
import { type Block } from "~/app/components/main/chats/types";
import { Separator } from "~/app/components/ui/separator";

export type ValidationBlockProps = React.HTMLAttributes<HTMLDivElement> & {
  indexBlock: number;
  block: Block;
  showSeparator: boolean;
  isLoading?: boolean;
  onClickValidation: (
    blockId: number,
    messageId: number,
    textValidation: "Yes" | "No",
  ) => void;
};

export const ValidationBlock = (props: ValidationBlockProps) => {
  const { block, indexBlock, showSeparator, isLoading, onClickValidation } =
    props;
  return (
    <AnimatePresence>
      {block.blockMessages.map((message, index) => {
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
              index={indexBlock}
              blockId={block.id}
              message={message}
              onClickValidation={onClickValidation}
            />
            {isLoading && index == block.blockMessages.length - 1 && (
              <Message
                index={0}
                blockId={block.id}
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
                  diagnosisBlock: 0,
                  orderNumber: 0,
                }}
                onClickValidation={onClickValidation}
              />
            )}
          </motion.div>
        );
      })}
      {showSeparator && (
        <Separator
          className="w-3/4 self-center bg-gray-20"
          orientation="horizontal"
        />
      )}
    </AnimatePresence>
  );
};
