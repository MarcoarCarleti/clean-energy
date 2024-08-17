import { ArrowDownCircleIcon } from "lucide-react";

const Apresentation = () => {
  return (
    <div className="flex flex-col w-full h-screen">
      <div className="flex flex-col items-center justify-center w-full h-screen">
        <div className="text-start max-lg:mt-16 text-xl flex flex-col max-lg:items-center gap-2 text-muted-foreground">
          <span>Conheça o </span>
          <h1 className="text-9xl max-lg:text-7xl  max-sm:text-4xl font-bold max-lg:text-center text-foreground">
            Clean Energy
          </h1>
          <span className="text-end pt-4">A Sua plataforma de energia.</span>
        </div>
      </div>

      <ArrowDownCircleIcon className="self-center mb-8 animate-bounce w-12 h-12" />
    </div>
  );
};

export default Apresentation;
