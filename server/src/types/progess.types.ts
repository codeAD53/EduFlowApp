export type ProgressStatus = 'not_started' | 'in_progress' | 'completed'

export interface UpdateProgressInput {
        topic_id: number
        status: ProgressStatus
}

export interface ProgressResponse {
    progress_id: number
    user_id: number
    topic_id: number
    status: ProgressStatus,
    updated_at: string
}

export interface RoadmapProgress {
    roadmap_id: string
    title: string
    total_topics: number
    completed_topics: number
    completion_percentage: number
    topics: TopicProgress[]
}

export interface TopicProgress {
    topic_id: number
    title: string
    week_number: number
    order_index: number
    status: ProgressStatus
}