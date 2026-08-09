// Les props sont les données que le composant reçoit.
interface StatCardProps {
  label: string;
  value: string | number;
}

export default function StatCard({ label, value }: StatCardProps) {
  return (
    // Carte réutilisable pour afficher un indicateur du club
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">

      {/* Nom de l'indicateur */}
      <p className="text-sm text-zinc-500">
        {label}
      </p>

      {/* Valeur de l'indicateur */}
      <p className="mt-2 text-3xl font-bold">
        {value}
      </p>

    </div>
  );
}