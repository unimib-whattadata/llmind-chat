"use client";
import * as React from "react";
import { SidebarHeader } from "~/app/components/ui/sidebar";
import { Plus } from "lucide-react";
import { Button } from "~/app/components/ui/button";
import { Dialog, DialogTrigger } from "~/app/components/ui/dialog";
import { AddChatDialog } from "~/app/components/sidebar/nav/add-chat-dialog";
import { api } from "~/trpc/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSidebar } from "~/app/components/ui/sidebar";
// This is sample data.
export function MicareSidebarHeader({
  ...props
}: React.ComponentProps<typeof SidebarHeader>) {
  const utils = api.useUtils();
  const { auth } = useSidebar();
  const createChat = api.chats.createChat.useMutation({
    onSuccess: async () => await utils.chats.getChats.invalidate(),
  });

  const formSchema = z.object({
    chatName: z.string().min(1, {
      message: "Text message must be at least 1 character",
    }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chatName: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    createChat.mutate({
      userToken: auth.userId,
      chatName: data.chatName,
    });
  }

  return (
    <SidebarHeader {...props}>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="flex max-h-8 flex-row justify-start rounded-3xl bg-forest-green-700">
            <Plus className="text-white" size={18} />
            <span className="text-sm font-normal">New Chat</span>
          </Button>
        </DialogTrigger>
        <AddChatDialog
          form={form}
          onSubmitFunction={form.handleSubmit(onSubmit)}
        />
      </Dialog>
    </SidebarHeader>
  );
}
