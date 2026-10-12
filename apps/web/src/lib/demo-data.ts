import type { CurrentUser } from "../features/auth/api";
import type { Mission } from "../features/missions/api";
import type { PlayerDetail } from "../features/players/api";
import type { EvaluationGrid } from "../features/evaluations/api";

const date = (offset: number) => {
  const value = new Date();
  value.setDate(value.getDate() + offset);
  value.setHours(19, 30, 0, 0);
  return value.toISOString();
};
const clubs = [
  { id: 1, name: "FC Rives du Lac", country: "Suisse" },
  { id: 2, name: "Union Montclair", country: "France" },
  { id: 3, name: "Étoile des Alpes", country: "Suisse" },
];
const user: CurrentUser = {
  id: 1,
  fullName: "Yaya Démo",
  email: "scout@example.test",
  role: "scout",
  createdAt: date(-90),
};
const players: PlayerDetail[] = [
  ["Noah", "Mercier", "MC", "prioritaire"],
  ["Ilyes", "Laurent", "AG", "suivi"],
  ["Lucas", "Morel", "DC", "prise_de_contact"],
  ["Adam", "Perrin", "BU", "suivi"],
  ["Sacha", "Roche", "GB", "a_observer"],
  ["Maël", "Dubois", "MDC", "decouvert"],
].map(([firstName, lastName, officialPosition, status], index) => ({
  id: index + 1,
  firstName,
  lastName,
  officialPosition,
  status,
  club: clubs[index % clubs.length],
  dateOfBirth: "2005-04-12",
  createdAt: date(-30),
  statusHistory: [
    {
      id: index + 1,
      status,
      note: "Profil fictif de démonstration",
      createdAt: date(-7),
      changedByUser: user,
    },
  ],
  observations: [],
}));
const missions: Mission[] = (
  ["proposee", "acceptee", "evaluation_a_completer", "terminee"] as const
).map((status, index) => ({
  id: index + 1,
  matchId: index + 1,
  scoutId: user.id,
  status,
  declineReason: null,
  respondedAt: null,
  createdAt: date(-10),
  scout: user,
  match: {
    id: index + 1,
    matchDate: date([2, 5, -1, -7][index]),
    competition: "Championnat espoirs · Démo",
    venue: "Stade des Rives",
    homeClub: clubs[index % 3],
    awayClub: clubs[(index + 1) % 3],
  },
  targets: players.slice(index, index + 2).map((player) => ({ id: player.id, player })),
}));
const grid: EvaluationGrid = {
  id: 1,
  name: "Grille de démonstration",
  positionType: "outfield",
  isActive: true,
  categories: ["Technique", "Mental", "Physique", "Comportement"].map((name, index) => ({
    id: index + 1,
    evaluationGridId: 1,
    name,
    displayOrder: index,
    criteria: [
      {
        id: index + 1,
        evaluationCategoryId: index + 1,
        name: ["Qualité de passe", "Lecture du jeu", "Explosivité", "Engagement"][index],
        displayOrder: 0,
      },
    ],
  })),
};

export async function demoRequest<T>(path: string, method = "GET"): Promise<T> {
  if (method !== "GET")
    throw new Error(
      "Mode démo : aperçu uniquement. Aucune modification enregistrée. Connectez le backend pour tester cette action.",
    );
  let result: unknown;
  if (path === "/api/v1/me") result = user;
  else if (path === "/api/v1/missions") result = missions;
  else if (/^\/api\/v1\/missions\/\d+$/.test(path))
    result = missions.find((item) => item.id === Number(path.split("/").at(-1)));
  else if (path === "/api/v1/players") result = players;
  else if (/^\/api\/v1\/players\/\d+$/.test(path))
    result = players.find((item) => item.id === Number(path.split("/").at(-1)));
  else if (path === "/api/v1/clubs") result = clubs;
  else if (path === "/api/v1/matches") result = missions.map((item) => item.match);
  else if (path === "/api/v1/scouts") result = [user];
  else if (path === "/api/v1/evaluation-grids/active") result = grid;
  if (result === undefined) throw new Error("Cette donnée n’existe pas dans la démonstration.");
  return structuredClone(result) as T;
}
