export interface Profile {
  id: string
  user_id: string
  name: string
  title: string
  bio: string
  avatar_url: string | null
  location: string | null
  website: string | null
  github: string | null
  linkedin: string | null
  twitter: string | null
  email: string | null
  theme: 'light' | 'dark' | 'system'
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  profile_id: string
  title: string
  description: string
  tech_stack: string[]
  live_url: string | null
  github_url: string | null
  image_url: string | null
  featured: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface Experience {
  id: string
  profile_id: string
  company: string
  position: string
  location: string | null
  start_date: string
  end_date: string | null
  current: boolean
  description: string
  display_order: number
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  profile_id: string
  name: string
  category: string
  proficiency: number
  display_order: number
}
