"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRef, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/trpc/react";
import Loader from "~/app/components/ui/loader";
import { ChatError } from "~/app/components/main/chats/chatError";
import { ValidationBlock } from "~/app/components/main/chats/validation-chat/validation-block";
import { ChatMessageList } from "~/app/components/main/chats/chat-message-list";
import { FormMessage } from "~/app/components/main/chats/formMessage";
import { useSidebar } from "~/app/components/ui/sidebar";

type ValidationChatType = React.HTMLAttributes<HTMLDivElement> & {};

export const ValidationChat = (props: ValidationChatType) => {
  const { auth } = useSidebar();
  const utils = api.useUtils();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const updateBlock = api.validationBlock.updateBlock.useMutation({
    onSuccess: async () => await utils.validationBlock.getBlocks.invalidate(),
  });
  const blocks = api.validationBlock.getBlocks.useQuery({
    userToken: auth.userId,
  });

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [blocks]);

  const formSchema = z.object({
    message: z.string().min(1, {
      message: "Text message must be at least 1 character",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    form.reset({ message: "" });
    updateBlock.mutate({
      userToken: auth.userId,
      blockId: blocks.data?.current?.id ?? 0,
      messageId: 0,
      currentblockOperation:
        blocks.data?.current?.currentOperation ?? "FINISHED",
      response: data.message,
    });
  }

  if (blocks.isLoading) {
    return <Loader className="h-full w-full bg-transparent" />;
  }

  if (blocks.isError) {
    return <ChatError />;
  }

  const onClickValidation = (
    blockId: number,
    messageId: number,
    textValidation: "Yes" | "No",
  ) => {
    updateBlock.mutate({
      userToken: auth.userId,
      blockId: blockId,
      messageId: messageId,
      currentblockOperation: "VALIDATION",
      response: textValidation,
    });
  };

  const onClickSkip = (blockId: number, messageId: number) => {
    updateBlock.mutate({
      userToken: auth.userId,
      blockId: blockId,
      messageId: messageId,
      currentblockOperation: "NOTE",
      response: "Skip",
    });
  };

  return (
    <>
      <div className="overflow-y-auto" ref={messagesEndRef}>
        <ChatMessageList>
          {blocks.data?.validated.map((block, index) => (
            <ValidationBlock
              indexBlock={index + 1}
              showSeparator={index != blocks.data?.validated.length - 1}
              key={index}
              block={block}
              onClickValidation={onClickValidation}
              onClickSkip={onClickSkip}
            />
          ))}
          {blocks.data?.current && (
            <ValidationBlock
              indexBlock={blocks.data?.validated.length + 1}
              isLoading={updateBlock.isPending}
              showSeparator={false}
              block={blocks.data.current}
              onClickValidation={onClickValidation}
              onClickSkip={onClickSkip}
            />
          )}
          <div ref={messagesEndRef}></div>
        </ChatMessageList>
      </div>
      {blocks.isFetched && (
        <FormMessage
          form={form}
          onSubmit={form.handleSubmit(onSubmit)}
          disabled={
            blocks.data?.current?.currentOperation == "VALIDATION" ||
            !blocks.data?.current
          }
        />
      )}
    </>
  );
};
