import { motion } from "framer-motion";
import {
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Circle,
    ExternalLink,
} from "lucide-react";

import type {
    Topic,
    ProgressStatus,
    ResourceType,
} from "../../types";
import Loader from "../common/Loader";

interface TopicCardProps {
    topic: Topic;
    status?: ProgressStatus;
    isExpanded: boolean;
    isUpdating: boolean;
    onToggle: (topicId: number) => void;
    onStatusChange: (
        topicId: number,
        status: ProgressStatus
    ) => void;
}

const TopicCard = ({
    topic,
    status = "not_started",
    isExpanded,
    isUpdating,
    onToggle,
    onStatusChange,
}: TopicCardProps) => {
    const getTopicStatusColor = (
        status: ProgressStatus
    ) => {
        switch (status) {
            case "completed":
                return "border-green-500/30 bg-green-500/10";

            case "in_progress":
                return "border-yellow-500/30 bg-yellow-500/10";

            default:
                return "border-gray-700 bg-gray-800/50";
        }


    };

    const getResourceTypeColor = (
        type: ResourceType
    ) => {
        switch (type) {
            case "video":
                return "bg-red-500/10 text-red-400";


            case "article":
                return "bg-blue-500/10 text-blue-400";

            case "documentation":
                return "bg-purple-500/10 text-purple-400";

            case "exercise":
                return "bg-green-500/10 text-green-400";

            default:
                return "bg-gray-500/10 text-gray-400";
        }


    };

    return (

        <motion.div layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}>
            <div className="space-y-3">
                {
                    <div
                        className={`border rounded-xl overflow-hidden transition ${getTopicStatusColor(status)}`}
                    >
                        {/* Topic Header */}
                        <div className="flex items-center gap-3 p-4">
                            {/* Status icon */}
                            <button onClick={() => onStatusChange(topic.topic_id, status === 'completed' ? 'not_started' : 'completed')}
                                disabled={isUpdating}
                                className="shrink-0 disabled:cursor-not-allowed ">
                                {isUpdating ? (
                                    <Loader inline size="sm" />
                                ) : status === 'completed' ? (
                                    <CheckCircle2 size={22} className="text-green-400" />
                                ) : (
                                    <Circle size={22} className="text-gray-600" />
                                )}
                            </button>

                            {/* Topic title */}
                            <div className="flex-1 min-w-0">
                                <p className={`font-medium truncate ${status === 'completed' ? 'text-gray-400 line-through' : 'text-white'}`}>{topic.title}</p>

                                <p className="text-xs text-gray-500 mt-1">{topic.week_number}</p>
                            </div>

                            {/* In Progress button */}
                            {status !== 'completed' && (
                                
                                <button 
                                aria-label={status as ProgressStatus === "completed" ? "Mark as Not Started" : "Mark as Completed"}
                                onClick={() => onStatusChange(topic.topic_id, status === 'in_progress' ? 'not_started' : 'in_progress')} disabled={isUpdating} className={`text-xs px-2.5 py-1 rounded-full border transition disabled:cursor-not-allowed ${status === 'in_progress' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                                    : 'text-gray-600 border-gray-700 hover:text-yellow-400'}`}>{status === 'in_progress' ? 'In Progress' : 'Start'}</button>
                            )}

                            {/* Expand Toggle  */}
                            <button 
                            aria-label={isExpanded ? "Collapse Topic Details" : "Expand Topic Details"}
                            onClick={() => onToggle(topic.topic_id)}
                                className="text-gray-500 hover:text-white transition shrink-0">
                                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>
                        </div>
                        {/* Expand content  */}
                        {isExpanded && (
                            <div className="border-t border-gray-800 px-4 py-4 bg-gray-900/50">
                                {/* Description  */}

                                <p className="text-gray-400 text-sm mb-4">
                                    {topic.description}
                                </p>

                                {/* Resources */}

                                {topic.resources && topic.resources.length > 0 && (
                                    <div>
                                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Resources</p>
                                        <div className="space-y-2">
                                            {topic.resources.map(resource => (
                                                <a key={resource.resource_id}
                                                    href={resource.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-3 p-3 rounded-lg
                                             bg-gray-800 hover:bg-gray-700
                                             border border-gray-700 transition group"
                                                >
                                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize shrink-0 ${getResourceTypeColor(resource.type)}`}>{resource.type}</span>
                                                    <span className="text-gray-300 text-sm flex-1 group-hover:text-white transition truncate">{resource.title}</span>
                                                    <ExternalLink size={14} className="text-gray-600
                                                group-hover:text-indigo-400 shrink-0"/>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                }
            </div>
        </motion.div>
    );
};

export default TopicCard;
