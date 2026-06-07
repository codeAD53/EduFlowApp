import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { BookOpen, CheckCircle2, Clock3, Search } from "lucide-react";
import Loader from "../components/common/Loader";
import RoadmapCard from "../components/roadmap/RoadmapCard";
import Navbar from "../components/layout/Navbar";
import EmptyState from "../components/common/EmptyState";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import { useRoadmaps } from "../hooks/useRoadmaps";
import StatsCard from "../components/dashboard/StatsCard";
import { useState } from "react";

const Dashboard = () => {

    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { roadmaps = [], isLoading, deletingId, deleteRoadmapById } = useRoadmaps();
    const [searchTerm, setSearchTerm] = useState("");

    const totalRoadmaps = roadmaps.length;
    const completedRoadmaps = roadmaps.filter((roadmap) => roadmap.is_completed).length;
    const activeRoadmaps = totalRoadmaps - completedRoadmaps;

    const filteredRoadmaps = roadmaps.filter((roadmap) =>
        roadmap.title.toLowerCase().includes(searchTerm.toLowerCase()) || roadmap.goal.toLowerCase().includes(searchTerm.toLowerCase()))
    return (
        <div className="min-h-screen bg-gray-950 text-white">

            {/* Navbar  */}
            <Navbar userName={user?.name} onLogout={() => {
                logout();
                toast.success("Logged out successfully");
                navigate('/login');
            }} showLogout />

            {/* main content */}

            <div className="max-w-6xl mx-auto px-6 py-10">
                {/* Header */}
                <DashboardHeader roadmapCount={roadmaps.length}
                    onCreateRoadmap={() => navigate('/generate')} />

                {roadmaps.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <StatsCard title="Total Roadmaps" value={totalRoadmaps} subtitle="All learning plans" icon={<BookOpen size={20} />} />

                        <StatsCard title="Completed" value={completedRoadmaps} subtitle="Finished roadmaps" icon={<CheckCircle2 size={20} />} />

                        <StatsCard title="In Progress" value={activeRoadmaps} subtitle="Currently Learning" icon={<Clock3 size={20} />} />
                    </div>
                )}

                {/* Loading state */}
                {isLoading && (
                    <div className="py-20">
                        <Loader size="lg" inline text="Loading your roadmaps..." />
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && roadmaps.length === 0 && (
                    <EmptyState icon={
                        <BookOpen size={48} className="text-gray-700" />
                    }
                        title="No Roadmaps Yet"
                        description="Generate your first AI-Powered learning roadmap"
                        buttonText="Generate Roadmap"
                        onButtonClick={() => navigate('/generate')}
                    />
                )}

                {!isLoading &&
                    roadmaps.length > 0 &&
                    filteredRoadmaps.length === 0 && (
                        <EmptyState
                            icon={<Search size={48} className="text-gray-700" />}
                            title="No matching roadmaps"
                            description="Try searching with different keywords"
                        />
                    )}
                    {roadmaps.length > 0 && (
                    <div className="relative mb-6">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                        />

                        <input
                            type="text"
                            placeholder="Search roadmaps..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>
                )}

                { !isLoading && roadmaps.length > 0 && (<p className="text-sm text-gray-500 mb-4">
                    Showing {filteredRoadmaps.length} of {roadmaps.length} roadmaps
                </p>)}

                {/* Roadmap grid */}
                {!isLoading && filteredRoadmaps.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredRoadmaps.map((roadmap, index) => (
                            <RoadmapCard
                                key={roadmap.roadmap_id}
                                roadmap={roadmap}
                                index={index}
                                deletingId={deletingId}
                                onDelete={deleteRoadmapById}
                            />
                        ))}
                    </div>
                )}

                
            </div>
        </div>
    )
}
export default Dashboard