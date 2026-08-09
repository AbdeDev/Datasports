import { Club } from "@/src/types/club";
import StatCard from "@/src/components/StatCard/StatCard";

// Données que le composant reçoit depuis la page.
// Équivalent d'un @Input() Angular.
interface ClubDashboardProps {
  club: Club;
}

export default function ClubDashboard({
  club,
}: ClubDashboardProps) {
  return (
    // Responsive :
    // Mobile = petit padding
    // Tablette / Desktop = padding plus important
    <section className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">

      {/* ============================= */}
      {/* HEADER DU CLUB */}
      {/* ============================= */}

      {/* Mobile : éléments les uns sous les autres */}
      {/* Desktop : titre à gauche, bouton à droite */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 sm:text-sm">
            Club Analysis
          </p>

          {/* Taille du titre responsive */}
          <h2 className="mt-1 text-2xl font-bold sm:text-3xl">
            {club.name}
          </h2>

          <p className="mt-2 text-sm text-zinc-400 sm:text-base">
            {club.country} - {club.league}
          </p>
        </div>

        {/* Mobile : bouton pleine largeur */}
        {/* Desktop : largeur automatique */}
        <button
          className="
            w-full
            rounded-lg
            bg-white
            px-5
            py-3
            text-sm
            font-semibold
            text-black
            transition
            hover:bg-zinc-200
            sm:w-auto
          "
        >
          New Recruitment Need
        </button>

      </div>

      {/* ============================= */}
      {/* KPI DU CLUB */}
      {/* ============================= */}

      {/* Mobile   : 1 colonne */}
      {/* Tablette : 2 colonnes */}
      {/* Desktop  : 4 colonnes */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

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

      {/* Mobile / tablette : 1 colonne */}
      {/* Desktop : Performance 2/3 + Needs 1/3 */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* PERFORMANCE */}
        <div
          className="
            rounded-xl
            border
            border-zinc-800
            bg-zinc-900
            p-4
            sm:p-6
            lg:col-span-2
          "
        >
          <h3 className="text-lg font-semibold">
            Club Performance
          </h3>

          <div
            className="
              mt-6
              flex
              h-48
              items-center
              justify-center
              rounded-lg
              border
              border-dashed
              border-zinc-700
              px-4
              text-center
              text-sm
              text-zinc-500
              sm:h-56
            "
          >
            Performance chart coming soon
          </div>
        </div>

        {/* CLUB NEEDS */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6">

          <h3 className="text-lg font-semibold">
            Club Needs
          </h3>

          <div className="mt-6 rounded-lg bg-zinc-800 p-4">

            <p className="text-sm font-medium">
              No recruitment need yet
            </p>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Create the first need for {club.name}.
            </p>

          </div>
        </div>

      </div>

      {/* ============================= */}
      {/* DIAGNOSTIC FOOTBALL */}
      {/* ============================= */}

      {/* Mobile : 1 colonne */}
      {/* Tablette/Desktop : 2 colonnes */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">

        {/* FORCES */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6">

          <h3 className="text-lg font-semibold">
            Strengths
          </h3>

          <p className="mt-4 text-sm leading-6 text-zinc-500">
            Club analysis will appear here.
          </p>

        </div>

        {/* FAIBLESSES */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6">

          <h3 className="text-lg font-semibold">
            Weaknesses
          </h3>

          <p className="mt-4 text-sm leading-6 text-zinc-500">
            Club analysis will appear here.
          </p>

        </div>

      </div>

    </section>
  );
}