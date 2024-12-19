"use client";
import { ChatList } from "~/app/components/main/chats/chat-list";
import { Send } from "lucide-react";
import { Button } from "~/app/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "~/app/components/ui/textarea";
import { cn } from "~/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/app/components/ui/form";

type ChatProps = React.HTMLAttributes<HTMLDivElement> & {
  chatId: number;
};

export const Chat = (props: ChatProps) => {
  const { chatId, className } = props;
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
    console.log(data);
  }
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
        isLoading={false}
        messages={[
          {
            id: 1,
            role: "AI",
            text: "Hi! I am LLMind, How can I help you",
            timestamp: new Date(),
            hasValidation: false,
            messageType: "CLINICAL",
            title: null,
            orderNumber: 0,
            chatId: 0,
            diagnosisBlock: 0,
          },
          {
            id: 1,
            role: "USER",
            text: "User Question",
            timestamp: new Date(),
            hasValidation: false,
            messageType: "CLINICAL",
            title: null,
            orderNumber: 0,
            chatId: 0,
            diagnosisBlock: 0,
          },
        ]}
      />
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt- relative m-4 flex flex-1 overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              size="sm"
              className="ml-auto mr-3 gap-1.5 self-center bg-transparent text-gray-40"
            >
              <Send size={24} />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
