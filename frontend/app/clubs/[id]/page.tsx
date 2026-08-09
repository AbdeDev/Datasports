import Sidebar from "@/src/components/Sidebar/Sidebar";
import ClubDashboard from "@/src/components/ClubDashboard/ClubDashboard";
import { Club } from "@/src/types/club";

// Données temporaires pour tester le frontend.
// Plus tard, elles seront remplacées par l'API backend.
const clubs: Record<string, Club> = {
  lausanne: {
    id: "lausanne",
    name: "FC Lausanne-Sport",
    country: "Switzerland",
    league: "Swiss Super League",
    leaguePosition: 5,
    squadSize: 27,
    averageAge: 24.2,
    recruitmentNeeds: 0,
  },

  basel: {
    id: "basel",
    name: "FC Basel",
    country: "Switzerland",
    league: "Swiss Super League",
    leaguePosition: 2,
    squadSize: 26,
    averageAge: 23.8,
    recruitmentNeeds: 2,
  },
};

interface ClubPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ClubPage({
  params,
}: ClubPageProps) {

  // Next.js récupère l'id présent dans l'URL.
  // Exemple : /clubs/lausanne → id = "lausanne"
  const { id } = await params;

  // On récupère temporairement le club dans notre objet.
  const club = clubs[id];

  // Club inexistant
  if (!club) {
    return (
      <main className="min-h-screen bg-zinc-950 p-10 text-white">
        <h1 className="text-3xl font-bold">
          Club not found
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="flex min-h-screen">

        <Sidebar />

        {/* Même dashboard pour tous les clubs */}
        <ClubDashboard club={club} />

      </div>
    </main>
  );
}