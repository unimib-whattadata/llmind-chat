import { cn } from "~/lib/utils";
import { type UseFormReturn } from "react-hook-form";
import { Form, FormField, FormItem } from "~/app/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/app/components/ui/dialog";
import { Input } from "~/app/components/ui/input";
import { Button } from "~/app/components/ui/button";
import { type FormEventHandler } from "react";

type AuthenticationDialogType = React.HTMLAttributes<HTMLDivElement> & {
  isOpen: boolean;
  form: UseFormReturn<{ email: string }, any, undefined>;
  onSubmit: FormEventHandler<HTMLFormElement>;
};

export const AuthenticationDialog = (props: AuthenticationDialogType) => {
  const { form, isOpen, onSubmit, className } = props;

  return (
    <Dialog open={isOpen}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        className={cn("sm:max-w-[425px]", className)}
      >
        <DialogHeader>
          <DialogTitle>Insert Your Email</DialogTitle>
          <DialogDescription className="text-sm">
            Your Email will be stored to validate your access.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
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
  );
};
