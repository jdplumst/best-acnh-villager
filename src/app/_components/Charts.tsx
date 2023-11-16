"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart,
  BarElement,
  Legend,
  Tooltip,
  CategoryScale,
  LinearScale,
  Title,
} from "chart.js";
import { api } from "~/trpc/react";

export default function Charts() {
  Chart.register(
    BarElement,
    Legend,
    Tooltip,
    CategoryScale,
    LinearScale,
    Title,
  );

  const randomNum = () => Math.floor(Math.random() * 255);
  const randomRGB = () => `rgb(${randomNum()}, ${randomNum()}, ${randomNum()})`;
  const randomColourList = (l: number) => {
    const list = [];
    for (let i = 0; i < l; i++) {
      list.push(randomRGB());
    }
    return list;
  };

  const statistics = api.villager.getStatistics.useQuery();

  if (statistics.error) return <div>Error</div>;

  if (statistics.isLoading) return <div>Loading...</div>;

  return (
    <div className="flex w-4/5 flex-col items-center gap-y-10">
      {statistics.data.map((s) => (
        <Bar
          key={s.title}
          data={{
            labels: Object.keys(s.data),
            datasets: [
              {
                data: Object.values(s.data),
                backgroundColor: randomColourList(Object.keys(s.data).length),
              },
            ],
          }}
          options={{
            plugins: {
              title: {
                display: true,
                text: `Average Rating by ${s.title}`,
                color: "white",
              },
              legend: { display: false },
            },
            aspectRatio: 1,
            responsive: true,
            color: "black",
            scales: {
              x: { ticks: { color: "white" } },
              y: { ticks: { color: "white" } },
            },
          }}
        ></Bar>
      ))}
    </div>
  );
}
