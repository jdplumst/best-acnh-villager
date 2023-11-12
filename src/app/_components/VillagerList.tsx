"use client";

import { Fragment, useCallback, useEffect, useRef } from "react";
import { api } from "~/trpc/react";

export default function VillagerList() {
  const getVillagers = api.villager.getVillagers.useInfiniteQuery(
    {
      limit: 50,
    },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );

  const observer = useRef<IntersectionObserver | undefined>();
  const nextPageRef = useCallback(
    (node: HTMLDivElement) => {
      if (getVillagers.isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting && getVillagers.hasNextPage) {
          getVillagers.fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [getVillagers],
  );

  return (
    <div className="flex flex-col py-8">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {getVillagers.isSuccess &&
          getVillagers.data?.pages.map((p) => (
            <Fragment key={p.nextCursor}>
              {p.villagers.map((v) => (
                <div
                  key={v.id}
                  className="flex flex-col items-center gap-2 rounded-lg border-2 border-black bg-gray-800 p-4"
                >
                  <img src={v.photo} alt={`${v.name}'s photo`} />
                  <div className="text-lg font-semibold">{v.name}</div>
                  <div className="grid grid-cols-2 gap-x-5">
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
      <div ref={nextPageRef} className="mx-auto pt-4">
        {getVillagers.hasNextPage && `Loading More...`}
      </div>
    </div>
  );
}
