export default function Sidebar() {
  return (
    // Menu de navigation principal de Datasports
    <aside className="min-h-screen w-64 border-r border-zinc-800 bg-zinc-900 p-6">

      {/* Logo / nom de la plateforme */}
      <div>
        <h1 className="text-xl font-bold text-white">
          Datasports
        </h1>

        <p className="mt-1 text-xs text-zinc-500">
          Recruitment Intelligence
        </p>
      </div>

      {/* Navigation */}
      <nav className="mt-10 space-y-2 text-sm">

        {/* Page actuellement active */}
        <a
          href="#"
          className="block rounded-lg bg-zinc-800 px-4 py-3 font-medium text-white"
        >
          Dashboard
        </a>

        <a
          href="#"
          className="block rounded-lg px-4 py-3 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
        >
          Clubs
        </a>

        <a
          href="#"
          className="block rounded-lg px-4 py-3 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
        >
          Player Search
        </a>

        <a
          href="#"
          className="block rounded-lg px-4 py-3 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
        >
          Shortlist
        </a>

        <a
          href="#"
          className="block rounded-lg px-4 py-3 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
        >
          Compare
        </a>

        <a
          href="#"
          className="block rounded-lg px-4 py-3 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
        >
          Reports
        </a>

      </nav>
    </aside>
  );
}