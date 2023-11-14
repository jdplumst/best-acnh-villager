"use client";

import { api } from "~/trpc/react";

export default function Matchup() {
  const getMatchup = api.villager.getMatchup.useQuery();

  const vote = api.villager.vote.useMutation({
    onSuccess() {
      getMatchup.refetch();
    },
  });

  if (getMatchup.isLoading) return <div>Loading...</div>;

  if (getMatchup.error) return <div>Error</div>;

  return (
    <div className="flex items-center justify-evenly gap-5 sm:gap-10 md:gap-12 lg:gap-16 xl:gap-20">
      <div className="flex flex-col items-center gap-5 rounded-lg border-2 border-black bg-gray-800 p-4">
        <img src={getMatchup.data.villager1.photo} />
        <div className="text-xl font-medium">
          {getMatchup.data.villager1.name}
        </div>
        <button
          onClick={() => {
            vote.mutate({
              voteForId: getMatchup.data.villager1.id,
              voteAgainstId: getMatchup.data.villager2.id,
            });
          }}
          className="rounded-full bg-purple-200 p-2 text-center font-medium text-black hover:bg-purple-300 sm:p-4 sm:font-semibold md:text-xl"
        >
          Vote
        </button>
      </div>
      <div className="text-2xl font-medium sm:text-3xl lg:text-4xl">vs.</div>
      <div className="flex flex-col items-center gap-5 rounded-lg border-2 border-black bg-gray-800 p-4">
        <img src={getMatchup.data.villager2.photo} />
        <div className="text-xl font-medium">
          {getMatchup.data.villager2.name}
        </div>
        <button
          onClick={() => {
            vote.mutate({
              voteForId: getMatchup.data.villager2.id,
              voteAgainstId: getMatchup.data.villager1.id,
            });
          }}
          className="rounded-full bg-purple-200 p-2 text-center font-medium text-black sm:p-4 sm:font-semibold md:text-xl"
        >
          Vote
        </button>
      </div>
    </div>
  );
}
