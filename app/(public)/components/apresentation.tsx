import { ArrowDownCircleIcon } from "lucide-react";

const Apresentation = () => {
  return (
    <div className="flex flex-col w-full h-screen">
      <div className="flex flex-col items-center justify-center w-full h-screen">
        <div className="text-start text-xl flex flex-col gap-2 text-muted-foreground">
          <span>Conheça a </span>
          <h1 className="text-9xl font-bold text-foreground">Clean Energy</h1>
          <span className="text-end pt-4">A Sua plataforma de energia.</span>
        </div>
      </div>

      <ArrowDownCircleIcon className="self-center mb-8 animate-bounce w-12 h-12" />
    </div>
  );
};

export default Apresentation;
