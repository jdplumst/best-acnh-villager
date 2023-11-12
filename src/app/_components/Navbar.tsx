export default function Navbar() {
  return (
    <div className="flex flex-col items-center justify-items-center gap-x-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
      <a
        href="/rank"
        className="rounded-full p-2 hover:bg-purple-200 hover:text-black sm:p-4"
      >
        Rank
      </a>
      <span className="hidden sm:block">·</span>
      <a
        href="/leaderboard"
        className="rounded-full p-2 hover:bg-purple-200 hover:text-black sm:p-4"
      >
        Leaderboard
      </a>
      <span className="hidden sm:block">·</span>
      <a
        href="/statistics"
        className="rounded-full p-2 hover:bg-purple-200 hover:text-black sm:p-4"
      >
        Statistics
      </a>
      <span className="hidden sm:block">·</span>
      <a
        href="/villagers"
        className="rounded-full p-2 hover:bg-purple-200 hover:text-black sm:p-4"
      >
        Villagers
      </a>
      <span className="hidden sm:block">·</span>
      <a
        href="https://github.com/jdplumst/best-acnh-villager"
        className="rounded-full p-2 hover:bg-purple-200 hover:text-black sm:p-4"
      >
        GitHub
      </a>
      <span className="hidden sm:block">·</span>
      <a
        href="https://docs.google.com/spreadsheets/d/13d_LAJPlxMa_DubPTuirkIV4DERBMXbrWQsmSh8ReK4/edit#gid=400375391"
        className="rounded-full p-2 hover:bg-purple-200 hover:text-black sm:p-4"
      >
        Data Source
      </a>
    </div>
  );
}
