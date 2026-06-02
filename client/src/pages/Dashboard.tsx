import React, {useEffect, useState} from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth";
import type { Roadmap } from "../types";
import { deleteRoadmap, getAllRoadmaps } from "../services/roadmap.services";
import toast from "react-hot-toast";
import { BookOpen, ChevronRight, LogOut, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

const Dashboard = () => {

    const navigate = useNavigate();
    const {user, logout} = useAuth();

    const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    useEffect(() => {
        const loadRoadmaps = async () => {
            try {
                const data = await getAllRoadmaps();
                setRoadmaps(data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch roadmaps");
            } finally {
                setIsLoading(false);
            }
        };
        loadRoadmaps();
    }, []);
    const handleDelete = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation(); //preventing navigating to roadmap view

        if(!window.confirm('Delete this roadmap? This cannot be undone')) return 

        setDeletingId(id);
        try {
            await deleteRoadmap(id);
            setRoadmaps(prev => prev.filter(r => r.roadmap_id !== id));
            toast.success("Roadmap Deleted");
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete roadmap');
        }
        finally{
            setDeletingId(null);
        }
    }

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully");
        navigate('/login');
    }

    const getLevelColor = (level: string) => {
        switch(level){
            case 'beginner': return 'bg-green-500/10 text-green-400 border-green-500/20'
            case 'intermediate': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
            case 'advanced': return 'bg-red-500/10 text-red-400 border-red-500/20'
            default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
        }
    }
    return (
        <div className="min-h-screen bg-gray-950 text-white">

            {/* Navbar */}

            <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-10">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <h1 className="text-xl font-bold text-white">EduFlow</h1>
                <div className="flex items-center gap-4">
                    <span className="text-gray-400 text-sm">
                        Hey, <span className="text-white font-medium">{user?.name}</span>
                    </span>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm">
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </div>
            </nav>
            
            {/* main content */}

            <div className="max-w-6xl mx-auto px-6 py-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-white">My Roadmaps</h2>
                        <p className="text-gray-400 mt-1">
                            {roadmaps.length === 0 ? 'No Roadmaps yet - generate your first one!': `${roadmaps.length} roadmap${roadmaps.length > 1 ? 's': ''} in progress`}
                        </p>
                    </div>
                    <button onClick={()=>navigate('/generate')} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg transition">
                        <Plus size={18}/>
                        New Roadmap
                    </button>
                </div>

                {/* Loading state */}
                {isLoading && (
                   <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-500/50" />
                   </div>
                )}

                {/* Empty State */}
                {!isLoading && roadmaps.length === 0 && (
                    <motion.div
                     initial = {{ opacity: 0, y: 20}}
                     animate = {{opacity: 1, y: 0}}
                     className="text-center py-20"
                     >
                        <BookOpen size= {48} className="text-gray-700 mx-auto mb-4"/>
                        <h3 className="text-gray-400 text-lg font-medium">No Roadmaps yet</h3>
                        <p className="text-gray-400 text-sm mt-1 mb-6">
                            Generate your first AI-powered learning roadmap
                        </p>
                       <button onClick={()=>
                        navigate('/generate')
                       } className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition">Generate Roadmap</button>
                    </motion.div>
                )}

                {/* Roadmap grid */}
                {!isLoading && roadmaps.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {roadmaps.map((roadmap, index)=>(
                            <motion.div
                            key={roadmap.roadmap_id}
                            role="button"
                            tabIndex={0}
                            onKeyDown={((e)=>{
                                if(e.key === 'Enter' || e.key === ' '){
                                    e.preventDefault();
                                    navigate(`/roadmap/${roadmap.roadmap_id}`);
                                }
                            })}
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: index * 0.07}}
                            onClick={()=>navigate(`/roadmap/${roadmap.roadmap_id}`)} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-indigo-500/50 hover:bg-gray-800/50 cursor-pointer transition group">
                                {/* Level badge */}
                                <div className="flex items-center justify-between mb-4">
                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border capitalize ${getLevelColor(roadmap.level)}`}>{roadmap.level}</span>

                                    <button onClick={(e)=> handleDelete(roadmap.roadmap_id, e)} disabled={deletingId === roadmap.roadmap_id}
                                    aria-label={`Delete roadmap ${roadmap.title}`}className="text-gray-600 hover:text-red-400 transition disabled:cursor-not-allowed">
                                        <Trash2 size={16}/>
                                    </button>
                                </div>

                                {/* Title */}
                                <h3 className="text-white font-semibold text-lg mg-2 line-clamp-2">{roadmap.title}</h3>

                                {/* Goal */}
                                <p className="text-white font-semibold text-lg mb-2 line-clamp-2">
                                    {roadmap.goal}
                                </p>

                                {/* Footer */}
                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-800">
                                    <div className="flex items-center justify-center gap-3 text-xs text-gray-500">
                                        <span>{roadmap.duration}</span>
                                        <span>.</span>
                                        <span>{roadmap.total_topics ?? 0} topics</span>
                                    </div>
                                    <ChevronRight size={16} className="text-gray-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all"/>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
export default Dashboard