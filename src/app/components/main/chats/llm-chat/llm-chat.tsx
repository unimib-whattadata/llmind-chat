"use client";
import { ChatList } from "~/app/components/main/chats/chat-list";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "~/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Loader from "~/app/components/ui/loader";
import { FormMessage } from "~/app/components/main/chats/formMessage";
import { useSidebar } from "~/app/components/ui/sidebar";
import { api } from "~/trpc/react";
import { useRef, useEffect, useState } from "react";

type ChatProps = React.HTMLAttributes<HTMLDivElement> & {
  chatId: number;
};

export const LLMChat = (props: ChatProps) => {
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
      <>
        <div className="overflow-y-auto">
          <ChatList
            tmpMessageUser={tmpMessageUser}
            ref={messagesEndRef}
            isLoading={updateChat.isPending}
            messages={chat.data.messages}
          />
        </div>
        <FormMessage
          form={form}
          onSubmit={form.handleSubmit(onSubmit)}
          disabled={false}
        />
      </>
    );
  }

  return <Loader />;
};
