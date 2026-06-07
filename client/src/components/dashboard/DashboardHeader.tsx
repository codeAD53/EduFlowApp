import { Plus } from 'lucide-react';

interface DashboardHeaderProps{
    roadmapCount: number,
    onCreateRoadmap: () => void
}
const DashboardHeader = ({roadmapCount, onCreateRoadmap}: DashboardHeaderProps) => {
    const subtitle = roadmapCount === 0 ? "No Roadmaps yet. Generate new one" : `${roadmapCount} roadmap${roadmapCount > 1 ? "s":""} in progress`;

  return (
      <div className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-2xl font-bold text-white">
          My Roadmaps
        </h2>
        <p>{subtitle}</p>
      </div>

      <button onClick={onCreateRoadmap}  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg transition">
        <Plus size={18}/> 
        New Roadmap
      </button>
    </div>
  )
}

export default DashboardHeader
