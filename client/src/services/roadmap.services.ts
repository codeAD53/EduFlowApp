import api from './api'
import type { Roadmap } from '../types'

export const generateRoadmap = async (data: {
  title: string
  goal: string
  level: string
  duration: string
}): Promise<Roadmap> => {
  const res = await api.post('/roadmap/generate', data)
  return res.data.data
}

export const getAllRoadmaps = async (): Promise<Roadmap[]> => {
  const res = await api.get('/roadmap')
  return res.data.data
}

export const getRoadmapById = async (id: number): Promise<Roadmap> => {
  const res = await api.get(`/roadmap/${id}`)
  return res.data.data
}

export const deleteRoadmap = async (id: number): Promise<void> => {
  await api.delete(`/roadmap/${id}`)
}