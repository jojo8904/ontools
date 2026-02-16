export interface News {
  id: string
  title: string
  summary: string
  original_content: string
  source: string
  published_at: string
  categories: NewsCategory[]
  related_tools: ToolId[]
  url: string
  image_url: string | null
  created_at: string
  updated_at: string
}

export type NewsCategory =
  | 'tech'
  | 'finance'
  | 'health'
  | 'energy'
  | 'game'
  | 'general'

export type ToolId =
  | 'salary'
  | 'currency'
  | 'retirement'
  | 'bmi'
  | 'unit'
  | 'dday'
  | 'electricity'
