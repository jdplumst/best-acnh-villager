import { api } from "~/trpc/server";
import Navbar from "../_components/Navbar";
import { Metadata } from "next";

export const generateMetadata = (): Metadata => {
  return {
    title: "Best ACNH Villager - Leaderboard",
    icons: [{ rel: "icon", url: "/favicon.ico" }],
  };
};

export default async function Leaderboard() {
  const leaderboard = await api.villager.getLeaderboard.query();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between gap-y-5 bg-gradient-to-b from-[#2e026d] to-[#15162c] px-4 py-8 text-white">
      <h2 className="pt-4 text-center text-5xl font-bold">Leaderboard</h2>
      <table className="border-2 border-black">
        <thead className="text-center">
          <tr>
            <th className="border-2 border-black font-medium sm:p-4 sm:text-xl sm:font-bold md:text-2xl">
              Rank
            </th>
            <th className="border-2 border-black font-medium sm:p-4 sm:text-xl sm:font-bold md:text-2xl">
              Villager
            </th>
            <th className="border-2 border-black font-medium sm:p-4 sm:text-xl sm:font-bold md:text-2xl">
              Rating
            </th>
            <th className="border-2 border-black font-medium sm:p-4 sm:text-xl sm:font-bold md:text-2xl">
              Wins
            </th>
            <th className="border-2 border-black font-medium sm:p-4 sm:text-xl sm:font-bold md:text-2xl">
              Losses
            </th>
            <th className="border-2 border-black font-medium sm:p-4 sm:text-xl sm:font-bold md:text-2xl">
              Winrate
            </th>
          </tr>
        </thead>
        <tbody className="text-center text-xs sm:text-xl sm:font-medium">
          {leaderboard.map((v) => (
            <tr key={v.id}>
              <td className="border-2 border-black sm:p-4">{v.rank}</td>
              <td className="border-2 border-black sm:p-4">
                <div className="flex items-center sm:gap-x-2">
                  <img src={v.icon} alt={`${v.name}'s icon`} width={24} />
                  {v.name}
                </div>
              </td>
              <td className="border-2 border-black sm:p-4">{v.rating}</td>
              <td className="border-2 border-black sm:p-4">{v.votesFor}</td>
              <td className="border-2 border-black sm:p-4">{v.votesAgainst}</td>
              <td className="border-2 border-black sm:p-4">{v.winRate}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Navbar />
    </main>
  );
}
