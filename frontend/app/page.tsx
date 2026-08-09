import Sidebar from "@/src/components/Sidebar/Sidebar";
import StatCard from "@/src/components/StatCard/StatCard";
import { Club } from "@/src/types/club"

export default function Home() {
  const club: Club = {
    id: "lausanne",
    name: "FC Lausanne-Sport",
    country: "Switzerland",
    league: "Swiss Super League",
    leaguePosition: 5,
    squadSize: 27,
    averageAge: 24.2,
    recruitmentNeeds: 0,
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="flex min-h-screen">

        {/* Sidebar réutilisable */}
        <Sidebar />

        {/* Contenu principal */}
        <section className="flex-1 p-8">

          {/* ============================= */}
          {/* HEADER DU CLUB */}
          {/* ============================= */}
          <div className="flex items-center justify-between">
            <div>
              <p className="mt-2 text-zinc-400">
                {club.country} - {club.league}
              </p>

              <h2 className="mt-1 text-3xl font-bold">
                {club.name}
              </h2>

              <p className="mt-2 text-zinc-400">
                Recruitment Intelligence Dashboard
              </p>
            </div>

            <button className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black">
              New Recruitment Need
            </button>
          </div>

          {/* ============================= */}
          {/* KPI DU CLUB */}
          {/* ============================= */}
          <div className="mt-10 grid grid-cols-4 gap-4">

            <StatCard
              label="League Position"
              value={club.leaguePosition ?? "—"}
            />

            <StatCard
              label="Squad Size"
              value={club.squadSize ?? "—"}
            />

            <StatCard
              label="Average Age"
              value={club.averageAge ?? "—"}
            />

            <StatCard
              label="Recruitment Needs"
              value={club.recruitmentNeeds ?? 0}
            />

          </div>

          {/* ============================= */}
          {/* PERFORMANCE + CLUB NEEDS */}
          {/* ============================= */}
          <div className="mt-6 grid grid-cols-3 gap-6">

            {/* Performance */}
            <div className="col-span-2 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
              <h3 className="text-lg font-semibold">
                Club Performance
              </h3>

              <div className="mt-8 flex h-56 items-center justify-center rounded-lg border border-dashed border-zinc-700 text-zinc-500">
                Performance chart coming soon
              </div>
            </div>

            {/* Besoins mercato */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
              <h3 className="text-lg font-semibold">
                Club Needs
              </h3>

              <div className="mt-6 rounded-lg bg-zinc-800 p-4">
                <p className="text-sm font-medium">
                  No recruitment need yet
                </p>

                <p className="mt-2 text-sm text-zinc-400">
                  Create the first need for {club.name}.
                </p>
              </div>
            </div>

          </div>

          {/* ============================= */}
          {/* DIAGNOSTIC FOOTBALL */}
          {/* ============================= */}
          <div className="mt-6 grid grid-cols-2 gap-6">

            {/* Forces */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
              <h3 className="text-lg font-semibold">
                Strengths
              </h3>

              <p className="mt-4 text-sm text-zinc-500">
                Club analysis will appear here.
              </p>
            </div>

            {/* Faiblesses */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
              <h3 className="text-lg font-semibold">
                Weaknesses
              </h3>

              <p className="mt-4 text-sm text-zinc-500">
                Club analysis will appear here.
              </p>
            </div>

          </div>

        </section>
      </div>
    </main>
  );
}