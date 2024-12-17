import { cn } from "~/lib/utils";

type ChatErrorType = React.HTMLAttributes<HTMLDivElement> & {};

export const ChatError = (props: ChatErrorType) => {
  const { className } = props;
  return (
    <div className={cn("h-full w-full bg-transparent", className)}>
      <p className="text-base text-red-500">
        Error on retrieving, try to refresh
      </p>
    </div>
  );
};
