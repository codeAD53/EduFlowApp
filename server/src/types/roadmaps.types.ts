export interface Resource {
    title: string
    url: string
    type: 'video' | 'article' | 'documentation' | 'exercise'
}

export interface Topic{
        title: string
        description: string
        week_number: number
        order_index: number
        resources: Resource[]
}

export interface RoadmapInput{
    title: string
    goal: string
    level: 'beginner' | 'intermediate' | 'advanced'
    duration: string
}

export interface RoadmapResponse {
    roadmap_id: number
    user_id: number
    title: string
    goal: string
    level: string
    duration: string
    is_completed: boolean
    created_at: string
    topics: TopicResponse[]
}

export interface TopicResponse{
    topic_id: number
    title: string
    description: string
    week_number: number
    order_index: number
    resources: ResourceResponse[]
}
export interface ResourceResponse{
    resource_id: number
    topic_id: number
    title: string
    type: string
    url: string
}

//AI RETURNS

export interface AIRoadmapOutput{
    title: string,
    topics: {
        title: string
        description: string
        week_number: number
        order_index: number
        resources: {
            title: string
            type: string
            url: string
        }[]
    }[]
}

