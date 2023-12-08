import { Metadata } from "next";
import Navbar from "../_components/Navbar";
import VillagerList from "../_components/VillagerList";

export const generateMetadata = (): Metadata => {
  return {
    title: "Best ACNH Villager - Villagers",
    icons: [{ rel: "icon", url: "/favicon.ico" }],
  };
};

export default function Villagers() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-gradient-to-b from-[#2e026d] to-[#15162c] px-4 py-8 text-white">
      <h2 className="pt-4 text-center text-5xl font-bold">Villagers</h2>
      <VillagerList />
      <Navbar />
    </main>
  );
}
