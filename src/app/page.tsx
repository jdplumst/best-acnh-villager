import Footer from "./_components/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-gradient-to-b from-[#2e026d] to-[#15162c] px-4 py-16 text-white">
      <h1 className="text-center text-5xl font-bold">
        Who is the Best Animal Crossing: New Horizons Villager?
      </h1>
      <a
        href="/rank"
        className="rounded-full bg-purple-200 p-4 text-xl font-semibold text-black"
      >
        Click Here to Find Out
      </a>
      <Footer></Footer>
    </main>
  );
}
