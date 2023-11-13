"use client";

import { Fragment, useState } from "react";
import { api } from "~/trpc/react";

export default function VillagerList() {
  const [name, setName] = useState<string | null>(null);

  const getVillagers = api.villager.getVillagers.useInfiniteQuery(
    {
      name: name,
      limit: 50,
    },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <input
        value={name ?? ""}
        onChange={(e) => {
          setName((e.target as HTMLInputElement).value);
        }}
        className="rounded-lg border-2 border-black p-2 text-center text-black outline-none md:w-96 xl:w-[520px] 2xl:w-[750px]"
      />
      {getVillagers.isInitialLoading && (
        <div className="mx-auto">Loading...</div>
      )}
      <div className="grid min-h-screen grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {getVillagers.isSuccess &&
          getVillagers.data?.pages.map((p) => (
            <Fragment key={p.nextCursor}>
              {p.villagers.map((v) => (
                <div
                  key={v.id}
                  className="flex max-h-[560px] flex-col items-center gap-2 rounded-lg border-2 border-black bg-gray-800 p-4"
                >
                  <img src={v.photo} alt={`${v.name}'s photo`} />
                  <div className="text-lg font-semibold">{v.name}</div>
                  <div className="grid w-72 grid-cols-2 gap-x-5">
                    <div>
                      <span className="font-medium">Species: </span>
                      {v.species}
                    </div>
                    <div>
                      <span className="font-medium">Gender: </span>
                      {v.gender}
                    </div>
                    <div>
                      <span className="font-medium">Personality: </span>
                      {v.personality}
                    </div>
                    <div>
                      <span className="font-medium">Subtype: </span>
                      {v.subtype}
                    </div>
                    <div>
                      <span className="col-span-2 font-medium">Birthday: </span>
                      {v.birthday}
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium">Catchphrase: </span>
                      {v.catchphrase}
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium">Favourite Song: </span>
                      {v.song}
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium">Favourite Saying: </span>
                      {v.saying}
                    </div>
                  </div>
                </div>
              ))}
            </Fragment>
          ))}
      </div>
      {getVillagers.hasNextPage && (
        <div className="mx-auto pt-4">
          <button
            className="rounded-full bg-purple-200 p-4 text-center text-xl font-semibold text-black hover:bg-purple-300"
            disabled={getVillagers.isFetching || getVillagers.isLoading}
            onClick={() => getVillagers.fetchNextPage()}
          >
            {getVillagers.isFetchingNextPage ? `Loading More...` : `Load More`}
          </button>
        </div>
      )}
    </div>
  );
}
