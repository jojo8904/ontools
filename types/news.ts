export interface News {
  _id: string
  title: string
  summary: string
  original_content: string
  source: string
  published_at: Date
  categories: NewsCategory[]
  related_tools: ToolId[]
  url: string
  createdAt: Date
  updatedAt: Date
}

export type NewsCategory =
  | 'tech'
  | 'finance'
  | 'labor'
  | 'health'
  | 'energy'
  | 'general'

export type ToolId =
  | 'salary'
  | 'currency'
  | 'retirement'
  | 'bmi'
  | 'unit'
  | 'dday'
  | 'electricity'
