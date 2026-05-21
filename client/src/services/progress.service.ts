import api from "./api";
import type {RoadmapProgress, ProgressStatus } from "../types";

export const updateProgress = async(topic_id:number, status: ProgressStatus):Promise<void> => {

    await api.patch('/progress',{topic_id, status});

}

export const getRoadmapProgress = async (roadmap_id: number):Promise<RoadmapProgress> => {
    const res = await api.get(`/progress/${roadmap_id}`)
    return res.data.data
}