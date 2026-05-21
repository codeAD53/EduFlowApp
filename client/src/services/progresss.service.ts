import api from './apii'
import type { RoadmapProgress, ProgressStatus } from '../types'

export const updateProgress = async (
  topic_id: number,
  status: ProgressStatus
): Promise<void> => {
  await api.patch('/progress', { topic_id, status })
}

export const getRoadmapProgress = async (
  roadmapId: number
): Promise<RoadmapProgress> => {
  const res = await api.get(`/progress/${roadmapId}`)
  return res.data.data
}