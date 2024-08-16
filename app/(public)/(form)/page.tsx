"use client";

import Apresentation from "./components/apresentation";
import HomeForm from "./components/form";

export default function Home() {
  return (
    <main className="flex flex-col">
      <Apresentation />

      <HomeForm />
    </main>
  );
}
