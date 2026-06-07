import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import type { ProgressStatus } from "../types";
import { motion } from "framer-motion";
import Loader from "../components/common/Loader";
import ProgressCard from "../components/roadmap/ProgressCard";
import PageHeader from "../components/layout/PageHeader";
import { useRoadmapView } from "../hooks/useRoadmapView";
import TopicCard from "../components/roadmap/TopicCard";
import { useTopicProgress } from "../hooks/useTopicProgress";



const RoadmapView = () => {
    const { id } = useParams();
    const roadmapId = Number(id);
    const navigate = useNavigate();
    const {
        roadmap,
        progress,
        setProgress,
        isLoading,
    } = useRoadmapView(
        Number.isNaN(roadmapId)
            ? undefined
            : roadmapId
    );

    const {
        updatingTopic,
        handleProgressUpdate,
    } = useTopicProgress(
        setProgress
    );

    const [expandedTopics, setExpandedTopics] = useState<Set<number>>(new Set())
    const toggleTopic = (topicId: number) => {
        setExpandedTopics(prev => {
            const next = new Set(prev)
            if (next.has(topicId)) {
                next.delete(topicId)
            } else {
                next.add(topicId)
            }
            return next
        })
    }
    const getTopicStatus = (topicId: number): ProgressStatus => {
        return (progress?.topics.find(t => t.topic_id === topicId)?.status) ?? 'not_started'
    }

    //Group topics by week
    const groupedTopics = roadmap?.topics?.reduce<Record<number, typeof roadmap.topics>>((acc, topic) => {
        const week = topic.week_number
        if (!acc[week]) acc[week] = []
        acc[week]!.push(topic)
        return acc
    }, {}
    )

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <Loader size="lg" inline text="Loading Roadmap" />
            </div>
        )
    }
    if (!roadmap) return (
        <div className="min-h-screen bg-gray-950 text-white">
            <PageHeader title="Roadmap" onBack={()=>navigate('/dashboard')}/>
            <div className="max-w-4xl mx-auto py-16 text-center">
                <p className="text-gray-400">Roadmap not found.</p>
                <button onClick={()=>navigate('dashboard')} className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition">Back to Dashboard</button>
            </div>
        </div>
    )
    return (
        <div className="min-h-screen bg-gray-950 text-white">
            {/* navbar */}
            <PageHeader
                title={roadmap.title}
                onBack={() => navigate("/dashboard")}
            />
            <div className="max-w-4xl mx-auto px-6 py-8">

                {/* Progress Card */}
                {progress && (
                    <ProgressCard
                        roadmap={roadmap}
                        progress={progress}
                    />
                )}

                {/* Topics by week */}
                {
                    groupedTopics && Object.entries(groupedTopics).map(([week, topics]) => (
                        <motion.div
                            key={week}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8"
                        >
                            <h2 className="text-xl font-bold text-white mb-4">
                                Week {week}
                            </h2>

                            <div className="space-y-4">
                                {topics.map((topic) => (
                                    <TopicCard
                                        key={topic.topic_id}
                                        topic={topic}
                                        status={getTopicStatus(topic.topic_id)}
                                        isExpanded={expandedTopics.has(topic.topic_id)}
                                        isUpdating={updatingTopic === topic.topic_id}
                                        onToggle={toggleTopic}
                                        onStatusChange={handleProgressUpdate}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    ))
                }
            </div>
        </div>
    )
}

export default RoadmapView