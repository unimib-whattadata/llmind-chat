import { HydrateClient } from "~/trpc/server";
import { Main } from "~/app/components/main/main";

export default async function Home() {
  return (
    <HydrateClient>
      <Main />
    </HydrateClient>
  );
}
