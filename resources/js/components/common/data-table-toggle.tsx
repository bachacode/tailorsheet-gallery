import { LucideGrid, LucideList } from "lucide-react";

interface DataTableToggleProps {
  view: 'grid' | 'table';
  setView: React.Dispatch<React.SetStateAction<"grid" | "table">>
}

export default function DataTableToggle({view, setView}: DataTableToggleProps) {
  return (
    <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-2">
            <button
              onClick={() => setView("grid")}
              className={`px-4 py-2 rounded cursor-pointer ${view === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              <LucideGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("table")}
              className={`px-4 py-2 rounded cursor-pointer ${view === 'table' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              <LucideList className="h-4 w-4" />
            </button>
          </div>
        </div>
  )
}
