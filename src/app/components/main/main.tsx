"use client";
import { useSidebar } from "~/app/components/ui/sidebar";
import { ValidationChat } from "~/app/components/main/chats/validation-chat/validation-chat";
import { cn } from "~/lib/utils";
import { Chat } from "~/app/components/main/chats/chat/chat";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/app/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "~/app/components/ui/input";
import { Button } from "~/app/components/ui/button";
import { Form, FormField, FormItem } from "~/app/components/ui/form";
import { api } from "~/trpc/react";

type MainType = React.HTMLAttributes<HTMLDivElement> & {};

export const Main = (props: MainType) => {
  const { className } = props;
  const { mainContent, auth, setAuth } = useSidebar();
  console.log(auth);
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
        <Dialog open={!auth.isAuth}>
          <DialogContent
            onInteractOutside={(e) => {
              e.preventDefault();
            }}
            className="sm:max-w-[425px]"
          >
            <DialogHeader>
              <DialogTitle>Insert Your Email</DialogTitle>
              <DialogDescription className="text-sm">
                Your Email will be stored to validate your access.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <div className="flex w-full max-w-sm items-center space-x-2">
                        <Input placeholder="Email" {...field} />
                        <Button type="submit" className="bg-forest-green-700">
                          Register
                        </Button>
                      </div>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      ) : mainContent.validation ? (
        <ValidationChat title="Clinical Cases" />
      ) : (
        <Chat chatId={mainContent.chatId} />
      )}
    </div>
  );
};
