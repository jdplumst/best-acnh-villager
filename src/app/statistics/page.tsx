import Navbar from "../_components/Navbar";
import Charts from "../_components/Charts";
import { type Metadata } from "next";

export const generateMetadata = (): Metadata => {
  return {
    title: "Best ACNH Villager - Statistics",
    icons: [{ rel: "icon", url: "/favicon.ico" }],
  };
};

export default function Statistics() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between gap-y-5 bg-gradient-to-b from-[#2e026d] to-[#15162c] px-4 py-8 text-white">
      <h2 className="pt-4 text-center text-5xl font-bold">Statistics</h2>
      <Charts />
      <Navbar />
    </main>
  );
}
