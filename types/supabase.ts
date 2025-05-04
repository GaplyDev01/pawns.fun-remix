export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      games: {
        Row: {
          black_id: string | null
          created_at: string
          fen_position: string | null
          id: string
          pgn: string | null
          rating_diff: number | null
          result: string | null
          time_control: string | null
          white_id: string | null
          white_time_remaining: number | null
          black_time_remaining: number | null
        }
        Insert: {
          black_id?: string | null
          created_at?: string
          fen_position?: string | null
          id?: string
          pgn?: string | null
          rating_diff?: number | null
          result?: string | null
          time_control?: string | null
          white_id?: string | null
          white_time_remaining?: number | null
          black_time_remaining?: number | null
        }
        Update: {
          black_id?: string | null
          created_at?: string
          fen_position?: string | null
          id?: string
          pgn?: string | null
          rating_diff?: number | null
          result?: string | null
          time_control?: string | null
          white_id?: string | null
          white_time_remaining?: number | null
          black_time_remaining?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "games_black_id_fkey"
            columns: ["black_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_white_id_fkey"
            columns: ["white_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          // No rating column exists in the actual schema
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          // No rating column exists in the actual schema
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          // No rating column exists in the actual schema
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      rating_history: {
        Row: {
          created_at: string
          id: string
          rating: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          rating?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          rating?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rating_history_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
