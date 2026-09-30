export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
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
        Insert: {
          id?: string
          user_id: string
          name?: string
          title?: string
          bio?: string
          avatar_url?: string | null
          location?: string | null
          website?: string | null
          github?: string | null
          linkedin?: string | null
          twitter?: string | null
          email?: string | null
          theme?: 'light' | 'dark' | 'system'
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
        Relationships: []
      }
      projects: {
        Row: {
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
        Insert: {
          id?: string
          profile_id: string
          title: string
          description?: string
          tech_stack?: string[]
          live_url?: string | null
          github_url?: string | null
          image_url?: string | null
          featured?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['projects']['Insert']>
        Relationships: []
      }
      experience: {
        Row: {
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
        Insert: {
          id?: string
          profile_id: string
          company: string
          position: string
          location?: string | null
          start_date: string
          end_date?: string | null
          current?: boolean
          description?: string
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['experience']['Insert']>
        Relationships: []
      }
      skills: {
        Row: {
          id: string
          profile_id: string
          name: string
          category: string
          proficiency: number
          display_order: number
        }
        Insert: {
          id?: string
          profile_id: string
          name: string
          category?: string
          proficiency?: number
          display_order?: number
        }
        Update: Partial<Database['public']['Tables']['skills']['Insert']>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
