export default function Footer() {
  return (
    <div className="flex items-center gap-2">
      <a
        href="/rank"
        className="rounded-full p-4 hover:bg-purple-200 hover:text-black"
      >
        Rank
      </a>
      <span>·</span>
      <a
        href="/leaderboard"
        className="rounded-full p-4 hover:bg-purple-200 hover:text-black"
      >
        Leaderboard
      </a>
      <span>·</span>
      <a
        href="/statistics"
        className="rounded-full p-4 hover:bg-purple-200 hover:text-black"
      >
        Statistics
      </a>
      <span>·</span>
      <a
        href="/villagers"
        className="rounded-full p-4 hover:bg-purple-200 hover:text-black"
      >
        Villagers
      </a>
      <span>·</span>
      <a
        href="https://github.com/jdplumst/best-acnh-villager"
        className="rounded-full p-4 hover:bg-purple-200 hover:text-black"
      >
        GitHub
      </a>
      <span>·</span>
      <a
        href="https://docs.google.com/spreadsheets/d/13d_LAJPlxMa_DubPTuirkIV4DERBMXbrWQsmSh8ReK4/edit#gid=400375391"
        className="rounded-full p-4 hover:bg-purple-200 hover:text-black"
      >
        Data Source
      </a>
    </div>
  );
}
