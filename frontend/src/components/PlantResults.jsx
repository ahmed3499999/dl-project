export default function PlantResults({ results }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <svg
          className="w-6 h-6 text-emerald-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M6 2a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3H6zm0 2h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
        </svg>
        <h2 className="text-2xl font-bold text-white">Plant Information</h2>
      </div>

      <div className="bg-slate-700/50 border border-emerald-700/30 rounded-lg p-6">
        <p className="text-emerald-50 whitespace-pre-wrap leading-relaxed">{results}</p>
      </div>
    </div>
  )
}
