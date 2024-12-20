"use client";
import { ChatList } from "~/app/components/main/chats/chat-list";
import { Send } from "lucide-react";
import { Button } from "~/app/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "~/app/components/ui/textarea";
import { cn } from "~/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Loader from "~/app/components/ui/loader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "~/app/components/ui/form";
import { useSidebar } from "~/app/components/ui/sidebar";
import { api } from "~/trpc/react";
import { useRef, useEffect, useState } from "react";

type ChatProps = React.HTMLAttributes<HTMLDivElement> & {
  chatId: number;
};

export const Chat = (props: ChatProps) => {
  const { chatId, className } = props;
  const utils = api.useUtils();
  const { auth } = useSidebar();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [tmpMessageUser, setTmpMessageUser] = useState<string>("");
  const updateChat = api.chats.updateChat.useMutation({
    onSuccess: async () => await utils.chats.getChat.invalidate(),
  });
  const chat = api.chats.getChat.useQuery({
    userToken: auth.userId,
    chatId: chatId,
  });

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [chat]);

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
    setTmpMessageUser(data.message);
    form.reset({ message: "" });
    updateChat.mutate({
      chatId: chatId,
      message: data.message,
    });
  }

  if (chat.data) {
    return (
      <div
        className={cn(
          "relative flex h-[calc(100vh-55px)] w-full flex-col overflow-hidden bg-gray-10",
          className,
        )}
      >
        <h1 className="overflow-hidden p-4 align-top font-bold text-forest-green-700">
          Chat {chatId}
        </h1>
        <ChatList
          tmpMessageUser={tmpMessageUser}
          ref={messagesEndRef}
          isLoading={updateChat.isPending}
          messages={chat.data.messages}
        />
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
                control={form.control}
                name="message"
                render={({ field }) => (
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
                )}
              />
              <Button
                type="submit"
                size="sm"
                className="ml-auto mr-3 gap-1.5 self-center bg-transparent text-gray-40 hover:bg-forest-green-100 focus:bg-forest-green-100"
              >
                <Send size={24} />
              </Button>
            </form>
          </Form>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex h-[calc(100vh-55px)] w-full flex-col overflow-hidden bg-gray-10",
        className,
      )}
    >
      <Loader />
    </div>
  );
};
