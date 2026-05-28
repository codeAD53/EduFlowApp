import {useEffect, useState} from "react"
import { useNavigate, useParams } from "react-router-dom"
import type { ProgressStatus } from "../types";
import type { Roadmap, RoadmapProgress } from "../types";
import { getRoadmapById } from "../services/roadmap.services";
import { getRoadmapProgress, updateProgress } from "../services/progress.services";
import toast from "react-hot-toast";
import { ArrowLeft,  CheckCircle2, ChevronDown, ChevronUp, Circle, Clock3, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";



const RoadmapView = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
    const [progress, setProgress] = useState<RoadmapProgress | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedTopics, setExpandedTopics] = useState<Set<number>>(new Set())
    const [updatingTopic, setUpdatingTopic] = useState<number | null>(null);

    useEffect(()=>{

        const fetchData = async (roadmapId:number) => {
            try {
                const [roadmapData, progressData] = await Promise.all([
                    getRoadmapById(roadmapId),
                    getRoadmapProgress(roadmapId)
                ])
                setRoadmap(roadmapData);
                setProgress(progressData);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load roadmap");
                navigate('/dashboard')
            }
            finally{
                setIsLoading(false);
            }
        }
        
        if(id) fetchData(parseInt(id))
    }, [id, navigate])


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

    const handleProgressUpdate = async (topicId: number, status: ProgressStatus) => {

        setUpdatingTopic(topicId);
        try {
            await updateProgress(topicId, status);

            //Update progress state locally
            setProgress(prev => {
                if(!prev) return prev;
                const updatedTopics = prev.topics.map(t => t.topic_id === topicId ? {...t, status} : t)
                const completed = updatedTopics.filter(t=>t.status === 'COMPLETED').length
                const percentage = Math.round((completed / updatedTopics.length) * 100)
                return {
                    ...prev,
                    topics: updatedTopics,
                    completed_topics: completed,
                    completion_percentage: percentage
                }
            })
            // ensure correct typing when comparing ProgressStatus to string literals
            const message = status === ("COMPLETED" as unknown as ProgressStatus)
                ? 'Topic completed!'
                : status === ("IN_PROGRESS" as unknown as ProgressStatus)
                    ? 'Marked as in progress'
                    : 'Marked as not started'

            toast.success(message)
        } catch (err) {
            console.error(err);
            toast.error('Failed to update progress');
        }finally{
            setUpdatingTopic(null);
        }

    }


    const getTopicStatus = (topicId:number):ProgressStatus => {
        return (progress?.topics.find(t => t.topic_id === topicId)?.status as ProgressStatus) || 'NOT_STARTED'
    }

    const getStatusColor = (status: string) => {
        switch(status){
            case 'COMPLETED': return 'text-green-400 border-green-500/30 bg-green-500/10'
            case 'IN_PROGRESS': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10'
            default:            return 'text-gray-500 border-gray-700 bg-gray-800/50'
        }
    }

    const getResourceTypeColor = (type:string) => {
        switch(type){
            case 'video':         return 'bg-red-500/10 text-red-400'
            case 'article':       return 'bg-blue-500/10 text-blue-400'
            case 'documentation': return 'bg-purple-500/10 text-purple-400'
            case 'exercise':      return 'bg-green-500/10 text-green-400'
            default:              return 'bg-gray-500/10 text-gray-400'
        }
    }

    //Group topics by week
    const groupedTopics = roadmap?.topics?.reduce((acc, topic)=>{
        const week = topic.week_number
        if(!acc[week]) acc[week] = []
        acc[week].push(topic)
        return acc
    }, {} as Record<number, typeof roadmap.topics>)

    if(isLoading){
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2
                        border-indigo-500 border-opacity-50" />
            </div>
        )
    }
    if(!roadmap) return null
return (
<div className="min-h-screen bg-gray-950 text-white">
    {/* navbar */}
    <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-10">
    <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
        <button onClick={()=>navigate('/dashboard')} className="text-gray-400 hover:text-white transition"><ArrowLeft size={20}/></button>
        <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-white truncate">{roadmap.title}</h1>
        </div>
    </div>
    </nav>
    <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Progress Card */}
        {
            progress && (
                <motion.div 
                initial={{opacity: 0, y:20}}
                animate={{opacity: 1, y:0}}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-gray-400 text-sm">Overall Progress</p>
                            <p className="text-3xl font-bold text-white mt-1">
                                {progress.completion_percentage}%
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-400 text-sm">Topics completed</p>
                            <p className="text-xl font-semibold text-white mt-1">
                                {progress.completed_topics} / {progress.total_topics}
                            </p>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-gray-800 rounded-full h-2.5">
                        <motion.div 
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y:0}}
                        transition={{duration: 0.8, ease: 'easeInOut'}}
                        className="bg-indigo-500 h-2.5 rounded-full" />  
                    </div>

                    {/* Meta info */}
                    <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1.5">
                            <Clock3 size={14}/>
                            {roadmap.duration}
                        </span>
                        <span className="capitalize">{roadmap.level}</span>
                    </div>
                </motion.div>
            )
        }

        {/* Topics by week */}
        {
            groupedTopics && Object.entries(groupedTopics).map(([week, topics], weekIndex)=>(
                <motion.div
                initial={{opacity: 0, y:20}}
                animate={{opacity: 1, y:0}}
                transition={{delay: weekIndex * 0.05}}
                className="mb-6">
                    {/* Week Header */}
                    <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-widest mb-3">
                        Week {week}
                    </h3>

                    {/* Topics */}
                    <div className="space-y-3">
                        {
                            topics && topics.map((topic)=>{
                                const status = getTopicStatus(topic.topic_id)
                                const isExpanded = expandedTopics.has(topic.topic_id)
                                const isUpdating = updatingTopic === topic.topic_id

                                return (
                                    <div
                                    key={topic.topic_id}
                                    className={`border rounded-xl overflow-hidden transition ${getStatusColor(status)}`}>
                                        {/* Topic Header */}
                                        <div className="flex items-center gap-3 p-4">
                                            {/* Status icon */}
                                            <button onClick={()=>handleProgressUpdate(topic.topic_id, status === 'COMPLETED' ?'NOT_STARTED': 'COMPLETED')}
                                                disabled={isUpdating}
                                                className="shrink-0 disabled:cursor-not-allowed ">
                                                    {isUpdating ? (
                                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-indigo-400 "/>
                                                    ) : status === 'COMPLETED' ? (
                                                        <CheckCircle2 size={22} className="text-green-400" />
                                                    ): (
                                                        <Circle size={22} className="text-gray-600"/>
                                                    )}
                                                </button>

                                                {/* Topic title */}
                                                <div className="flex-1 min-w-0">
                                                    <p className={`font-medium truncate ${status === 'COMPLETED' ? 'text-gray-400 line-through': 'text-white'}`}>{topic.title}</p>
                                                </div>

                                                {/* In Progress button */}
                                                {status !== 'COMPLETED' && (
                                                    <button onClick={()=>handleProgressUpdate(topic.topic_id, status==='IN_PROGRESS' ? 'NOT_STARTED' : 'IN_PROGRESS')} disabled={isUpdating} className={`text-xs px-2.5 py-1 rounded-full border transistion disabled:cursor-not-allowed ${status === 'IN_PROGRESS'? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                                        : 'text-gray-600 border-gray-700 hover:text-yellow-400'}`}>{status === 'IN_PROGRESS' ? 'In Progress': 'Start'}</button>
                                                )}

                                                {/* Expand Toggle  */}
                                                <button onClick={()=>toggleTopic(topic.topic_id)}
                                                    className="text-gray-500 hover:text-white transition shrink-0">
                                                        {isExpanded ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
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
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-meduim capitalize shrink-0 ${getResourceTypeColor(resource.type)}`}>{resource.type}</span>
                                                <span className="text-gray-300 text-sm flex-1 group-hover:text-white transition truncate">{resource.title}</span>
                                                <ExternalLink size={14} className="text-gray-600
                                                group-hover:text-indigo-400shrink-0"/>
                                             </a>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )
                            })
                        }
                    </div>
                </motion.div>
            ))
        }
    </div>
    </div>

)
}
export default RoadmapView