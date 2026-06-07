import { useEffect, useState } from "react"
import type { Roadmap } from "../types";
import { deleteRoadmap, getAllRoadmaps } from "../services/roadmap.services";
import toast from "react-hot-toast";

export const useRoadmaps = () => {
    const [roadmaps, setRoadmaps] = useState<Roadmap[]>();
    const [isLoading, setIsLoading] = useState(false);
    const [deletingId, setIsDeletingId] = useState<number | null>(null);

    const loadRoadmaps = async () => {
        setIsLoading(true);
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

    useEffect(() => {
        const fetchRoadmaps = async () => {
            await loadRoadmaps();
        };

        void fetchRoadmaps();
    }, []);

    const deleteRoadmapById = async (
        id:number, e?: React.MouseEvent
    ) => {
        if(e){
             e.stopPropagation(); // preventing navigating to roadmap view
        }
        if(!window.confirm("Delete this roadmap? This cannot be undone")){
            return;
        }
        setIsDeletingId(id);

        try {
            await deleteRoadmap(id);
            setRoadmaps((prev) => prev ? prev.filter((roadmap) => roadmap.roadmap_id !== id) : prev);
            toast.success("Roadmap Deleted");
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete roadmap");
        }finally{
            setIsDeletingId(null);
        }
    };
    return {
        roadmaps,
        isLoading,
        deletingId,
        deleteRoadmapById,
        reloadRoadmaps: loadRoadmaps,
    }
}