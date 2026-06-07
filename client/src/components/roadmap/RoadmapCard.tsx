import { ChevronRight, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { Roadmap } from "../../types";

interface RoadmapCardProps {
  roadmap: Roadmap;
  index: number;
  deletingId: number | null;
  onDelete: (
    id: number,
    e: React.MouseEvent<HTMLButtonElement>
  ) => void;
}

export default function RoadmapCard({
  roadmap,
  index,
  deletingId,
  onDelete,
}: RoadmapCardProps) {
  const navigate = useNavigate();

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-500/10 text-green-400 border-green-500/20";

      case "intermediate":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";

      case "advanced":
        return "bg-red-500/10 text-red-400 border-red-500/20";

      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  return (
    <motion.div
      role="button"
      tabIndex={0}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      onClick={() => navigate(`/roadmap/${roadmap.roadmap_id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(`/roadmap/${roadmap.roadmap_id}`);
        }
      }}
      className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-indigo-500/50 hover:bg-gray-800/50 cursor-pointer transition group"
    >
      {/* Badge + Delete */}
      <div className="flex items-center justify-between mb-4">
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full border capitalize ${getLevelColor(
            roadmap.level
          )}`}
        >
          {roadmap.level}
        </span>

        <button
          onClick={(e) => onDelete(roadmap.roadmap_id, e)}
          disabled={deletingId === roadmap.roadmap_id}
          aria-label={`Delete roadmap ${roadmap.title}`}
          className="text-gray-600 hover:text-red-400 transition disabled:cursor-not-allowed"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Title */}
      <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
        {roadmap.title}
      </h3>

      {/* Goal */}
      <p className="text-gray-400 text-sm">
        {roadmap.goal}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-800">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>{roadmap.duration}</span>
          <span>•</span>
          <span>{roadmap.total_topics ?? 0} topics</span>
        </div>

        <ChevronRight
          size={16}
          className="text-gray-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all"
        />
      </div>
    </motion.div>
  );
}