"use client";
import { Send } from "lucide-react";
import { Button } from "~/app/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRef, useEffect } from "react";
import { Textarea } from "~/app/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/trpc/react";
import Loader from "~/app/components/ui/loader";
import { ChatError } from "~/app/components/main/chats/chatError";
import { ValidationBlock } from "~/app/components/main/chats/validation-chat/validation-block";
import { ChatMessageList } from "~/app/components/main/chats/chat-message-list";
import { useSidebar } from "~/app/components/ui/sidebar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/app/components/ui/form";

type ValidationChatType = React.HTMLAttributes<HTMLDivElement> & {
  title: string;
};

export const ValidationChat = (props: ValidationChatType) => {
  const { title } = props;
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
    return (
      <div className="relative flex h-[calc(100vh-55px)] w-full flex-col overflow-hidden bg-gray-10">
        <h1 className="overflow-hidden p-4 align-top font-bold text-forest-green-700">
          {title}
        </h1>
        <Loader className="h-full w-full bg-transparent" />
      </div>
    );
  }

  if (blocks.isError) {
    return (
      <div className="relative flex h-[calc(100vh-55px)] w-full flex-col overflow-hidden bg-gray-10">
        <h1 className="overflow-hidden p-4 align-top font-bold text-forest-green-700">
          {title}
        </h1>
        <ChatError />
      </div>
    );
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

  return (
    <div className="relative flex h-[calc(100vh-55px)] w-full flex-col overflow-hidden bg-gray-10">
      <h1 className="overflow-hidden p-4 align-top font-bold text-forest-green-700">
        {title}
      </h1>
      <ChatMessageList ref={messagesEndRef}>
        {blocks.data?.validated.map((block, index) => (
          <ValidationBlock
            showSeparator={index != blocks.data?.validated.length - 1}
            key={index}
            block={block}
            onClickValidation={onClickValidation}
          />
        ))}
        {blocks.data?.current && (
          <ValidationBlock
            isLoading={updateBlock.isPending}
            showSeparator={false}
            block={blocks.data.current}
            onClickValidation={onClickValidation}
          />
        )}
        <div ref={messagesEndRef}></div>
      </ChatMessageList>
      {blocks.isFetched && (
        <div>
          {form.formState.errors.message && (
            <p className="mx-4 text-xs text-red-400">
              {form.formState.errors.message?.message}
            </p>
          )}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt- relative m-4 mt-1 flex flex-1 overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
              x-chunk="dashboard-03-chunk-1"
            >
              <FormField
                disabled={
                  blocks.data?.current?.currentOperation == "VALIDATION" ||
                  !blocks.data?.current
                }
                control={form.control}
                name="message"
                render={({ field }) => {
                  return (
                    <FormItem className="w-full">
                      <FormControl>
                        <Textarea
                          id="message"
                          placeholder="Type your message here..."
                          className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
              <Button
                disabled={
                  blocks.data?.current?.currentOperation == "VALIDATION" ||
                  !blocks.data?.current
                }
                type="submit"
                size="sm"
                className="ml-auto mr-3 gap-1.5 self-center bg-transparent text-gray-40 hover:bg-forest-green-100 focus:bg-forest-green-100"
              >
                <Send size={24} />
              </Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
};
