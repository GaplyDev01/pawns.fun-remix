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
          increment_ms: number | null
          is_ai_game: boolean | null
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
          increment_ms?: number | null
          is_ai_game?: boolean | null
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
          increment_ms?: number | null
          is_ai_game?: boolean | null
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
      challenges: {
        Row: {
          id: string
          created_at: string
          challenger_id: string
          acceptor_id: string | null
          time_control: string
          color_preference: string
          status: string
          game_id: string | null
          initial_time_ms: number
          increment_ms: number
        }
        Insert: {
          id?: string
          created_at?: string
          challenger_id: string
          acceptor_id?: string | null
          time_control: string
          color_preference: string
          status?: string
          game_id?: string | null
          initial_time_ms: number
          increment_ms: number
        }
        Update: {
          id?: string
          created_at?: string
          challenger_id?: string
          acceptor_id?: string | null
          time_control?: string
          color_preference?: string
          status?: string
          game_id?: string | null
          initial_time_ms?: number
          increment_ms?: number
        }
        Relationships: [
          {
            foreignKeyName: "challenges_challenger_id_fkey"
            columns: ["challenger_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenges_acceptor_id_fkey"
            columns: ["acceptor_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenges_game_id_fkey"
            columns: ["game_id"]
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_game_sessions: {
        Row: {
          id: string
          created_at: string
          game_id: string
          user_id: string
          ai_level: string
          user_plays_as: string
        }
        Insert: {
          id?: string
          created_at?: string
          game_id: string
          user_id: string
          ai_level: string
          user_plays_as: string
        }
        Update: {
          id?: string
          created_at?: string
          game_id?: string
          user_id?: string
          ai_level?: string
          user_plays_as?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_game_sessions_game_id_fkey"
            columns: ["game_id"]
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_game_sessions_user_id_fkey"
            columns: ["user_id"]
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
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
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
