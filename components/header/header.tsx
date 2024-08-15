import { Button } from "../ui/button";

export const Header = () => {
  return (
    <div className="flex h-20 bg-foreground text-background border-b fixed w-screen border-b-zinc-300 justify-between items-center px-8">
      <span className="font-semibold text-3xl">Clean Energy</span>
      <Button variant={"outline"} className="text-white">
        Login
      </Button>
    </div>
  );
};
