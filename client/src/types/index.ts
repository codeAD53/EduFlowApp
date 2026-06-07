export interface User {
  id: number
  name: string
  email: string
}

export interface AuthResponse {
  token: string
  user: User
}
export type ResourceType =  'video' | 'article' | 'documentation' | 'exercise';
export type RoadmapLevel = 'beginner' | 'intermediate' | 'advanced';
export type ProgressStatus = 'not_started' | 'in_progress' | 'completed';
export interface Resource {
  resource_id: number
  topic_id: number
  title: string
  url: string
  type: ResourceType
}

export interface Topic {
  topic_id: number
  roadmap_id: number
  title: string
  description: string
  week_number: number
  order_index: number
  resources: Resource[]
  status?: ProgressStatus
}

export interface Roadmap {
  roadmap_id: number
  user_id: number
  title: string
  goal: string
  level: RoadmapLevel
  duration: string
  is_completed: boolean
  created_at: string
  total_topics?: number
  topics?: Topic[]
}

export interface RoadmapProgress {
  roadmap_id: number
  title: string
  total_topics: number
  completed_topics: number
  completion_percentage: number
  topics: {
    topic_id: number
    title: string
    week_number: number
    order_index: number
    status: ProgressStatus
  }[]
}