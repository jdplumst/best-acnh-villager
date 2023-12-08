import { type Metadata } from "next";
import Matchup from "../_components/Matchup";
import Navbar from "../_components/Navbar";

export const generateMetadata = (): Metadata => {
  return {
    title: "Best ACNH Villager - Rank",
    icons: [{ rel: "icon", url: "/favicon.ico" }],
  };
};

export default function Rank() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-gradient-to-b from-[#2e026d] to-[#15162c] px-4 py-8 text-white">
      <h2 className="pt-4 text-center text-5xl font-bold">
        Pick the Better{" "}
        <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Animal Crossing New: Horizons
        </span>{" "}
        Character
      </h2>
      <Matchup />
      <Navbar />
    </main>
  );
}
