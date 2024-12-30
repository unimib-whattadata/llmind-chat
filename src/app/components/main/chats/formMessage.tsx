import { cn } from "~/lib/utils";
import { Send } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "~/app/components/ui/form";
import { Button } from "~/app/components/ui/button";
import { type UseFormReturn } from "react-hook-form";
import { type FormEventHandler } from "react";
import { Textarea } from "~/app/components/ui/textarea";

type FormMessageProps = React.HTMLAttributes<HTMLDivElement> & {
  form: UseFormReturn<
    {
      message: string;
    },
    any,
    undefined
  >;
  onSubmit: FormEventHandler<HTMLFormElement>;
  disabled: boolean;
};

export const FormMessage = (props: FormMessageProps) => {
  const { form, onSubmit, disabled, className } = props;

  return (
    <div className={cn("", className)}>
      {form.formState.errors.message && (
        <p className="mx-4 text-xs text-red-400">
          {form.formState.errors.message?.message}
        </p>
      )}
      <Form {...form}>
        <form
          onSubmit={onSubmit}
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
                    disabled={disabled}
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
            disabled={disabled}
          >
            <Send size={24} />
          </Button>
        </form>
      </Form>
    </div>
  );
};
