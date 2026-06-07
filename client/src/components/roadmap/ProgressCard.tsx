import { Clock3 } from "lucide-react";
import { motion } from "framer-motion";
import type { Roadmap, RoadmapProgress } from "../../types";

interface ProgressCardProps {
  roadmap: Roadmap;
  progress: RoadmapProgress;
}

interface ProgressCardProps {
  roadmap: Roadmap;
  progress: RoadmapProgress;
}

const ProgressCard = ({
  roadmap,
  progress,
}: ProgressCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold text-lg">
            Overall Progress

            {progress.completion_percentage === 100 && (
              <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-full text-sm">
                🎉 Completed
              </span>
            )}
          </h3>

          <p className="text-gray-400 text-sm mt-1">
            {progress.completed_topics} of{" "}
            {progress.total_topics} topics completed
          </p>
        </div>

        <span className="text-2xl font-bold text-indigo-400">
          {progress.completion_percentage}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
        <div
          className="bg-indigo-500 h-full rounded-full transition-all duration-500"
          style={{
            width: `${progress.completion_percentage}%`,
          }}
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <Clock3 size={14} />
          <span>{roadmap.duration}</span>
        </div>

        <span>
          {progress.completed_topics}/
          {progress.total_topics} completed
        </span>
      </div>
    </motion.div>
  );
};

export default ProgressCard;