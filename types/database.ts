export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      challenges: {
        Row: {
          id: string
          challenger_id: string
          challenged_id: string
          game_mode_id: number
          status: "pending" | "accepted" | "rejected" | "expired" | "cancelled"
          game_id: string | null
          expires_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          challenger_id: string
          challenged_id: string
          game_mode_id: number
          status?: "pending" | "accepted" | "rejected" | "expired" | "cancelled"
          game_id?: string | null
          expires_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          challenger_id?: string
          challenged_id?: string
          game_mode_id?: number
          status?: "pending" | "accepted" | "rejected" | "expired" | "cancelled"
          game_id?: string | null
          expires_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      games: {
        Row: {
          id: string
          white_id: string | null
          black_id: string | null
          time_control: string | null
          fen_position: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          white_id?: string | null
          black_id?: string | null
          time_control?: string | null
          fen_position?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          white_id?: string | null
          black_id?: string | null
          time_control?: string | null
          fen_position?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          username: string | null
          avatar_url: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          username?: string | null
          avatar_url?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          username?: string | null
          avatar_url?: string | null
          updated_at?: string | null
        }
      }
      game_modes: {
        Row: {
          id: number
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          created_at?: string
        }
      }
    }
  }
}
