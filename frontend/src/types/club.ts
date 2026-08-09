// Représente les informations principales d'un club.
// Cette interface sera réutilisée dans toute l'application.
export interface Club {
  id: string;
  name: string;
  country: string;
  league: string;

  // Le "?" signifie que la donnée peut être absente.
  leaguePosition?: number;
  squadSize?: number;
  averageAge?: number;
  recruitmentNeeds?: number;
}