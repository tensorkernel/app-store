export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      apps: {
        Row: {
          id: string
          title: string
          description: string
          thumbnail_url: string
          screenshots: Json
          download_url: string
          category: string
          tags: string[]
          seo_keywords: string
          seo_description: string
          version: string
          publisher: string
          created_at: string
          updated_at: string
          download_count: number
        }
        Insert: {
          id?: string
          title: string
          description: string
          thumbnail_url: string
          screenshots: Json
          download_url: string
          category: string
          tags: string[]
          seo_keywords: string
          seo_description: string
          version: string
          publisher: string
          created_at?: string
          updated_at?: string
          download_count?: number
        }
        Update: {
          id?: string
          title?: string
          description?: string
          thumbnail_url?: string
          screenshots?: Json
          download_url?: string
          category?: string
          tags?: string[]
          seo_keywords?: string
          seo_description?: string
          version?: string
          publisher?: string
          created_at?: string
          updated_at?: string
          download_count?: number
        }
      }
      reviews: {
        Row: {
          id: string
          app_id: string
          user_name: string
          user_id?: string
          rating: number
          comment: string
          created_at: string
        }
        Insert: {
          id?: string
          app_id: string
          user_name: string
          user_id?: string
          rating: number
          comment: string
          created_at?: string
        }
        Update: {
          id?: string
          app_id?: string
          user_name?: string
          user_id?: string
          rating?: number
          comment?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          username: string
          avatar_url: string | null
          is_admin: boolean
          created_at: string
        }
        Insert: {
          id: string
          email: string
          username: string
          avatar_url?: string | null
          is_admin?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          avatar_url?: string | null
          is_admin?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
