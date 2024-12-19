import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/app/components/ui/dialog";
import { Form, FormField, FormItem } from "~/app/components/ui/form";
import { Button } from "~/app/components/ui/button";
import { Input } from "~/app/components/ui/input";
import { Label } from "~/app/components/ui/label";
import { cn } from "~/lib/utils";
import { type UseFormReturn } from "react-hook-form";
import { FormEventHandler } from "react";
import { DialogTrigger } from "@radix-ui/react-dialog";

export type AddChatDialogType = React.HTMLAttributes<HTMLDivElement> & {
  form: UseFormReturn<
    {
      chatName: string;
    },
    any,
    undefined
  >;
  onSubmitFunction: FormEventHandler<HTMLFormElement>;
};

export const AddChatDialog = (props: AddChatDialogType) => {
  const { form, onSubmitFunction, className } = props;
  return (
    <DialogContent className={cn("sm:max-w-[425px]", className)}>
      <DialogHeader>
        <DialogTitle className="text-forest-green-800">Add Chat</DialogTitle>
        <DialogDescription>
          Create a new chat by filling out the form below.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form x-chunk="dashboard-03-chunk-1" onSubmit={onSubmitFunction}>
          <FormField
            control={form.control}
            name="chatName"
            render={({ field }) => (
              <FormItem className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-forest-green-800">
                    Chat Name
                  </Label>
                  <Input placeholder="Chat" className="col-span-3" {...field} />
                </div>
              </FormItem>
            )}
          />
          <DialogFooter>
            <DialogTrigger asChild>
              <Button className="bg-forest-green-700" type="submit">
                Submit
              </Button>
            </DialogTrigger>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};
