"use client";
import { useSidebar } from "~/app/components/ui/sidebar";
import { ValidationChat } from "~/app/components/main/chats/validation-chat/validation-chat";
import { cn } from "~/lib/utils";
import { LLMChat } from "~/app/components/main/chats/llm-chat/llm-chat";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/trpc/react";
import { Chat } from "~/app/components/main/chats/chat";
import { AuthenticationDialog } from "~/app/components/main/authentication/authentication-dialog";

type MainType = React.HTMLAttributes<HTMLDivElement> & {};

export const Main = (props: MainType) => {
  const { className } = props;
  const { mainContent, auth, setAuth } = useSidebar();

  const authentication = api.users.authenticate.useMutation({
    onSuccess: (data) => {
      setAuth({
        isAuth: true,
        userId: data,
      });
    },
  });

  const formSchema = z.object({
    email: z.string().email().min(1, {
      message: "Email format must be correct",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    authentication.mutate(data.email);
  };

  return (
    <div
      className={cn(
        "relative flex h-[calc(100vh-55px)] w-full flex-col overflow-hidden bg-gray-10",
        className,
      )}
    >
      {!auth.isAuth ? (
        <AuthenticationDialog
          form={form}
          onSubmit={form.handleSubmit(onSubmit)}
          isOpen={!auth.isAuth}
        />
      ) : (
        <Chat
          title={
            mainContent.validation
              ? "Clinical Cases"
              : `Chat ${mainContent.chatId}`
          }
        >
          {mainContent.validation ? (
            <ValidationChat />
          ) : (
            <LLMChat chatId={mainContent.chatId} />
          )}
        </Chat>
      )}
    </div>
  );
};
