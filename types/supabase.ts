export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string
          description: string
          icon_url: string | null
          id: number
          is_active: boolean
          name: string
          requirement_count: number
          requirement_type: string
        }
        Insert: {
          created_at?: string
          description: string
          icon_url?: string | null
          id?: number
          is_active?: boolean
          name: string
          requirement_count?: number
          requirement_type: string
        }
        Update: {
          created_at?: string
          description?: string
          icon_url?: string | null
          id?: number
          is_active?: boolean
          name?: string
          requirement_count?: number
          requirement_type?: string
        }
        Relationships: []
      }
      admin_analytics: {
        Row: {
          ai_games_played: number
          average_game_duration_seconds: number | null
          created_at: string
          daily_active_users: number
          date: string
          games_played: number
          id: string
          new_users: number
          peak_concurrent_users: number
          popular_game_modes: Json | null
          total_chat_messages: number
          updated_at: string
          user_retention_data: Json | null
        }
        Insert: {
          ai_games_played?: number
          average_game_duration_seconds?: number | null
          created_at?: string
          daily_active_users?: number
          date: string
          games_played?: number
          id?: string
          new_users?: number
          peak_concurrent_users?: number
          popular_game_modes?: Json | null
          total_chat_messages?: number
          updated_at?: string
          user_retention_data?: Json | null
        }
        Update: {
          ai_games_played?: number
          average_game_duration_seconds?: number | null
          created_at?: string
          daily_active_users?: number
          date?: string
          games_played?: number
          id?: string
          new_users?: number
          peak_concurrent_users?: number
          popular_game_modes?: Json | null
          total_chat_messages?: number
          updated_at?: string
          user_retention_data?: Json | null
        }
        Relationships: []
      }
      ai_difficulty_levels: {
        Row: {
          created_at: string
          description: string
          elo_equivalent: number
          id: number
          is_active: boolean
          name: string
        }
        Insert: {
          created_at?: string
          description: string
          elo_equivalent: number
          id?: number
          is_active?: boolean
          name: string
        }
        Update: {
          created_at?: string
          description?: string
          elo_equivalent?: number
          id?: number
          is_active?: boolean
          name?: string
        }
        Relationships: []
      }
      ai_game_sessions: {
        Row: {
          ai_difficulty_id: number
          completed_at: string | null
          created_at: string
          game_id: string
          hints_used: number
          id: string
          player_color: string
          player_id: string
        }
        Insert: {
          ai_difficulty_id: number
          completed_at?: string | null
          created_at?: string
          game_id: string
          hints_used?: number
          id?: string
          player_color: string
          player_id: string
        }
        Update: {
          ai_difficulty_id?: number
          completed_at?: string | null
          created_at?: string
          game_id?: string
          hints_used?: number
          id?: string
          player_color?: string
          player_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_game_sessions_ai_difficulty_id_fkey"
            columns: ["ai_difficulty_id"]
            isOneToOne: false
            referencedRelation: "ai_difficulty_levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_game_sessions_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_game_sessions_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_hints: {
        Row: {
          ai_game_session_id: string
          created_at: string
          fen_position: string
          hint_content: Json
          hint_type: string
          id: string
        }
        Insert: {
          ai_game_session_id: string
          created_at?: string
          fen_position: string
          hint_content: Json
          hint_type: string
          id?: string
        }
        Update: {
          ai_game_session_id?: string
          created_at?: string
          fen_position?: string
          hint_content?: Json
          hint_type?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_hints_ai_game_session_id_fkey"
            columns: ["ai_game_session_id"]
            isOneToOne: false
            referencedRelation: "ai_game_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_moves_log: {
        Row: {
          created_at: string
          difficulty_level: string
          evaluation: number | null
          fen_position: string
          game_id: string
          id: string
          move: string
          reasoning: string | null
        }
        Insert: {
          created_at?: string
          difficulty_level: string
          evaluation?: number | null
          fen_position: string
          game_id: string
          id?: string
          move: string
          reasoning?: string | null
        }
        Update: {
          created_at?: string
          difficulty_level?: string
          evaluation?: number | null
          fen_position?: string
          game_id?: string
          id?: string
          move?: string
          reasoning?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_moves_log_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      analysis_queue: {
        Row: {
          completed_at: string | null
          created_at: string
          error: string | null
          game_id: string
          id: string
          priority: number
          processing_started_at: string | null
          result: Json | null
          status: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error?: string | null
          game_id: string
          id?: string
          priority?: number
          processing_started_at?: string | null
          result?: Json | null
          status: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error?: string | null
          game_id?: string
          id?: string
          priority?: number
          processing_started_at?: string | null
          result?: Json | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "analysis_queue_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          challenged_id: string
          challenger_id: string
          created_at: string
          expires_at: string
          game_id: string
          game_mode_id: number
          id: string
          status: string
          updated_at: string
        }
        Insert: {
          challenged_id: string
          challenger_id: string
          created_at?: string
          expires_at?: string
          game_id: string
          game_mode_id: number
          id?: string
          status?: string
          updated_at?: string
        }
        Update: {
          challenged_id?: string
          challenger_id?: string
          created_at?: string
          expires_at?: string
          game_id?: string
          game_mode_id?: number
          id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenges_challenged_id_fkey"
            columns: ["challenged_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenges_challenger_id_fkey"
            columns: ["challenger_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenges_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenges_game_mode_id_fkey"
            columns: ["game_mode_id"]
            isOneToOne: false
            referencedRelation: "game_modes"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          created_at: string
          id: string
          is_deleted: boolean
          is_system: boolean
          message: string
          room_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_deleted?: boolean
          is_system?: boolean
          message: string
          room_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_deleted?: boolean
          is_system?: boolean
          message?: string
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_rooms: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      chess_openings: {
        Row: {
          created_at: string
          description: string | null
          draw_rate: number | null
          eco_code: string
          fen_position: string
          id: number
          moves: string
          name: string
          popularity: number | null
          updated_at: string
          variation: string | null
          win_rate_black: number | null
          win_rate_white: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          draw_rate?: number | null
          eco_code: string
          fen_position: string
          id?: number
          moves: string
          name: string
          popularity?: number | null
          updated_at?: string
          variation?: string | null
          win_rate_black?: number | null
          win_rate_white?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          draw_rate?: number | null
          eco_code?: string
          fen_position?: string
          id?: number
          moves?: string
          name?: string
          popularity?: number | null
          updated_at?: string
          variation?: string | null
          win_rate_black?: number | null
          win_rate_white?: number | null
        }
        Relationships: []
      }
      collection_games: {
        Row: {
          collection_id: string
          created_at: string
          game_id: string | null
          id: string
          imported_game_id: string | null
          notes: string | null
          position: number
          updated_at: string
        }
        Insert: {
          collection_id: string
          created_at?: string
          game_id?: string | null
          id?: string
          imported_game_id?: string | null
          notes?: string | null
          position?: number
          updated_at?: string
        }
        Update: {
          collection_id?: string
          created_at?: string
          game_id?: string | null
          id?: string
          imported_game_id?: string | null
          notes?: string | null
          position?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_games_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "game_collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_games_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_games_imported_game_id_fkey"
            columns: ["imported_game_id"]
            isOneToOne: false
            referencedRelation: "imported_games"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_games: {
        Row: {
          created_at: string
          dashboard_id: string
          game_id: string
          id: string
          position: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          dashboard_id: string
          game_id: string
          id?: string
          position: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          dashboard_id?: string
          game_id?: string
          id?: string
          position?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_games_dashboard_id_fkey"
            columns: ["dashboard_id"]
            isOneToOne: false
            referencedRelation: "game_dashboards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dashboard_games_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      featured_games: {
        Row: {
          created_at: string
          description: string | null
          expires_at: string | null
          featured_at: string
          featured_by: string
          game_id: string
          id: string
          is_active: boolean
          priority: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          expires_at?: string | null
          featured_at?: string
          featured_by: string
          game_id: string
          id?: string
          is_active?: boolean
          priority?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          expires_at?: string | null
          featured_at?: string
          featured_by?: string
          game_id?: string
          id?: string
          is_active?: boolean
          priority?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "featured_games_featured_by_fkey"
            columns: ["featured_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "featured_games_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: true
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      friendships: {
        Row: {
          created_at: string
          friend_id: string
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          friend_id: string
          id?: string
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          friend_id?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "friendships_friend_id_fkey"
            columns: ["friend_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      game_analytics: {
        Row: {
          analysis_data: Json | null
          average_move_time_ms: number | null
          black_accuracy: number | null
          black_blunders: number
          black_player_id: string | null
          black_rating_change: number | null
          created_at: string
          game_duration_seconds: number | null
          game_id: string
          game_mode_id: number | null
          id: string
          opening_detected: string | null
          total_moves: number
          white_accuracy: number | null
          white_blunders: number
          white_player_id: string | null
          white_rating_change: number | null
        }
        Insert: {
          analysis_data?: Json | null
          average_move_time_ms?: number | null
          black_accuracy?: number | null
          black_blunders?: number
          black_player_id?: string | null
          black_rating_change?: number | null
          created_at?: string
          game_duration_seconds?: number | null
          game_id: string
          game_mode_id?: number | null
          id?: string
          opening_detected?: string | null
          total_moves?: number
          white_accuracy?: number | null
          white_blunders?: number
          white_player_id?: string | null
          white_rating_change?: number | null
        }
        Update: {
          analysis_data?: Json | null
          average_move_time_ms?: number | null
          black_accuracy?: number | null
          black_blunders?: number
          black_player_id?: string | null
          black_rating_change?: number | null
          created_at?: string
          game_duration_seconds?: number | null
          game_id?: string
          game_mode_id?: number | null
          id?: string
          opening_detected?: string | null
          total_moves?: number
          white_accuracy?: number | null
          white_blunders?: number
          white_player_id?: string | null
          white_rating_change?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "game_analytics_black_player_id_fkey"
            columns: ["black_player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_analytics_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_analytics_game_mode_id_fkey"
            columns: ["game_mode_id"]
            isOneToOne: false
            referencedRelation: "game_modes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_analytics_white_player_id_fkey"
            columns: ["white_player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      game_annotations: {
        Row: {
          annotation_data: Json
          annotation_type: string
          commentator_id: string
          created_at: string
          fen_position: string
          game_id: string
          id: string
          is_deleted: boolean
          is_private: boolean
          move_number: number | null
          updated_at: string
        }
        Insert: {
          annotation_data: Json
          annotation_type: string
          commentator_id: string
          created_at?: string
          fen_position: string
          game_id: string
          id?: string
          is_deleted?: boolean
          is_private?: boolean
          move_number?: number | null
          updated_at?: string
        }
        Update: {
          annotation_data?: Json
          annotation_type?: string
          commentator_id?: string
          created_at?: string
          fen_position?: string
          game_id?: string
          id?: string
          is_deleted?: boolean
          is_private?: boolean
          move_number?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_annotations_commentator_id_fkey"
            columns: ["commentator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_annotations_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      game_collections: {
        Row: {
          created_at: string
          description: string | null
          games_count: number
          id: string
          is_public: boolean
          name: string
          thumbnail_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          games_count?: number
          id?: string
          is_public?: boolean
          name: string
          thumbnail_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          games_count?: number
          id?: string
          is_public?: boolean
          name?: string
          thumbnail_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_collections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      game_commentators: {
        Row: {
          commentator_id: string
          game_id: string
          id: string
          is_active: boolean
          joined_at: string
          last_comment_at: string | null
        }
        Insert: {
          commentator_id: string
          game_id: string
          id?: string
          is_active?: boolean
          joined_at?: string
          last_comment_at?: string | null
        }
        Update: {
          commentator_id?: string
          game_id?: string
          id?: string
          is_active?: boolean
          joined_at?: string
          last_comment_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_commentators_commentator_id_fkey"
            columns: ["commentator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_commentators_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      game_comments: {
        Row: {
          comment: string
          commentator_id: string
          created_at: string
          fen_position: string | null
          game_id: string
          id: string
          is_deleted: boolean
          is_private: boolean
          move_number: number | null
          updated_at: string
        }
        Insert: {
          comment: string
          commentator_id: string
          created_at?: string
          fen_position?: string | null
          game_id: string
          id?: string
          is_deleted?: boolean
          is_private?: boolean
          move_number?: number | null
          updated_at?: string
        }
        Update: {
          comment?: string
          commentator_id?: string
          created_at?: string
          fen_position?: string | null
          game_id?: string
          id?: string
          is_deleted?: boolean
          is_private?: boolean
          move_number?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_comments_commentator_id_fkey"
            columns: ["commentator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_comments_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      game_dashboards: {
        Row: {
          created_at: string
          id: string
          is_default: boolean
          is_public: boolean
          layout: Json
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_default?: boolean
          is_public?: boolean
          layout: Json
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_default?: boolean
          is_public?: boolean
          layout?: Json
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_dashboards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      game_events: {
        Row: {
          created_at: string
          event_data: Json
          event_type: string
          game_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_data?: Json
          event_type: string
          game_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_data?: Json
          event_type?: string
          game_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_events_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      game_exports: {
        Row: {
          collection_id: string | null
          completed_at: string | null
          content: string
          created_at: string
          file_url: string | null
          format: string
          game_id: string | null
          id: string
          is_completed: boolean
          user_id: string
        }
        Insert: {
          collection_id?: string | null
          completed_at?: string | null
          content: string
          created_at?: string
          file_url?: string | null
          format: string
          game_id?: string | null
          id?: string
          is_completed?: boolean
          user_id: string
        }
        Update: {
          collection_id?: string | null
          completed_at?: string | null
          content?: string
          created_at?: string
          file_url?: string | null
          format?: string
          game_id?: string | null
          id?: string
          is_completed?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_exports_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "game_collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_exports_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_exports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      game_modes: {
        Row: {
          description: string
          has_ai: boolean
          id: number
          increment_seconds: number
          is_active: boolean
          is_rated: boolean
          name: string
          time_control_type: string
        }
        Insert: {
          description: string
          has_ai?: boolean
          id?: number
          increment_seconds?: number
          is_active?: boolean
          is_rated?: boolean
          name: string
          time_control_type: string
        }
        Update: {
          description?: string
          has_ai?: boolean
          id?: number
          increment_seconds?: number
          is_active?: boolean
          is_rated?: boolean
          name?: string
          time_control_type?: string
        }
        Relationships: []
      }
      game_position_analysis: {
        Row: {
          analysis_data: Json | null
          best_move: string | null
          created_at: string
          fen_position: string
          game_id: string
          id: string
          is_blunder: boolean
          is_brilliant: boolean
          is_mistake: boolean
          move_number: number
          move_played: string
          position_evaluation: number | null
        }
        Insert: {
          analysis_data?: Json | null
          best_move?: string | null
          created_at?: string
          fen_position: string
          game_id: string
          id?: string
          is_blunder?: boolean
          is_brilliant?: boolean
          is_mistake?: boolean
          move_number: number
          move_played: string
          position_evaluation?: number | null
        }
        Update: {
          analysis_data?: Json | null
          best_move?: string | null
          created_at?: string
          fen_position?: string
          game_id?: string
          id?: string
          is_blunder?: boolean
          is_brilliant?: boolean
          is_mistake?: boolean
          move_number?: number
          move_played?: string
          position_evaluation?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "game_position_analysis_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      game_spectators: {
        Row: {
          game_id: string
          id: string
          joined_at: string
          user_id: string
        }
        Insert: {
          game_id: string
          id?: string
          joined_at?: string
          user_id: string
        }
        Update: {
          game_id?: string
          id?: string
          joined_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_spectators_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_spectators_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      games: {
        Row: {
          black_player_id: string | null
          black_time_remaining: number | null
          created_at: string
          ended_at: string | null
          fen_position: string
          game_mode_id: number | null
          id: string
          is_public: boolean
          last_move_at: string | null
          move_history: Json | null
          pgn: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["game_status"]
          updated_at: string
          white_player_id: string | null
          white_time_remaining: number | null
          winner_id: string | null
        }
        Insert: {
          black_player_id?: string | null
          black_time_remaining?: number | null
          created_at?: string
          ended_at?: string | null
          fen_position?: string
          game_mode_id?: number | null
          id?: string
          is_public?: boolean
          last_move_at?: string | null
          move_history?: Json | null
          pgn?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["game_status"]
          updated_at?: string
          white_player_id?: string | null
          white_time_remaining?: number | null
          winner_id?: string | null
        }
        Update: {
          black_player_id?: string | null
          black_time_remaining?: number | null
          created_at?: string
          ended_at?: string | null
          fen_position?: string
          game_mode_id?: number | null
          id?: string
          is_public?: boolean
          last_move_at?: string | null
          move_history?: Json | null
          pgn?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["game_status"]
          updated_at?: string
          white_player_id?: string | null
          white_time_remaining?: number | null
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "games_black_player_id_fkey"
            columns: ["black_player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_game_mode_id_fkey"
            columns: ["game_mode_id"]
            isOneToOne: false
            referencedRelation: "game_modes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_white_player_id_fkey"
            columns: ["white_player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      imported_games: {
        Row: {
          created_at: string
          description: string | null
          game_id: string | null
          id: string
          imported_at: string
          is_public: boolean
          metadata: Json | null
          pgn: string
          source: string | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          game_id?: string | null
          id?: string
          imported_at?: string
          is_public?: boolean
          metadata?: Json | null
          pgn: string
          source?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          game_id?: string | null
          id?: string
          imported_at?: string
          is_public?: boolean
          metadata?: Json | null
          pgn?: string
          source?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "imported_games_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "imported_games_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_exercises: {
        Row: {
          created_at: string
          description: string
          expected_moves: string
          feedback_correct: string
          feedback_incorrect: string
          id: string
          initial_fen: string
          is_active: boolean
          lesson_id: string
          sequence_number: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          expected_moves: string
          feedback_correct: string
          feedback_incorrect: string
          id?: string
          initial_fen: string
          is_active?: boolean
          lesson_id: string
          sequence_number: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          expected_moves?: string
          feedback_correct?: string
          feedback_incorrect?: string
          id?: string
          initial_fen?: string
          is_active?: boolean
          lesson_id?: string
          sequence_number?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_exercises_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "training_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lobbies: {
        Row: {
          chat_room_id: string | null
          created_at: string
          current_players: number
          description: string | null
          id: string
          is_active: boolean
          is_public: boolean
          max_players: number
          name: string
          password: string | null
          updated_at: string
        }
        Insert: {
          chat_room_id?: string | null
          created_at?: string
          current_players?: number
          description?: string | null
          id?: string
          is_active?: boolean
          is_public?: boolean
          max_players?: number
          name: string
          password?: string | null
          updated_at?: string
        }
        Update: {
          chat_room_id?: string | null
          created_at?: string
          current_players?: number
          description?: string | null
          id?: string
          is_active?: boolean
          is_public?: boolean
          max_players?: number
          name?: string
          password?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lobbies_chat_room_id_fkey"
            columns: ["chat_room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      lobby_players: {
        Row: {
          id: string
          joined_at: string
          lobby_id: string
          player_id: string
          status: string
          updated_at: string
        }
        Insert: {
          id?: string
          joined_at?: string
          lobby_id: string
          player_id: string
          status: string
          updated_at?: string
        }
        Update: {
          id?: string
          joined_at?: string
          lobby_id?: string
          player_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lobby_players_lobby_id_fkey"
            columns: ["lobby_id"]
            isOneToOne: false
            referencedRelation: "lobbies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lobby_players_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      moves: {
        Row: {
          created_at: string
          fen_after_move: string
          game_id: string
          id: string
          is_capture: boolean
          is_check: boolean
          is_checkmate: boolean
          move_notation: string
          move_number: number
          move_time_ms: number | null
          player_id: string
        }
        Insert: {
          created_at?: string
          fen_after_move: string
          game_id: string
          id?: string
          is_capture?: boolean
          is_check?: boolean
          is_checkmate?: boolean
          move_notation: string
          move_number: number
          move_time_ms?: number | null
          player_id: string
        }
        Update: {
          created_at?: string
          fen_after_move?: string
          game_id?: string
          id?: string
          is_capture?: boolean
          is_check?: boolean
          is_checkmate?: boolean
          move_notation?: string
          move_number?: number
          move_time_ms?: number | null
          player_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "moves_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "moves_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          content: Json
          created_at: string
          id: string
          is_read: boolean
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          content: Json
          created_at?: string
          id?: string
          is_read?: boolean
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          is_read?: boolean
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pgn_import_requests: {
        Row: {
          created_at: string
          id: string
          pgn: string
          result: Json | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          pgn: string
          result?: Json | null
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          pgn?: string
          result?: Json | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pgn_import_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      player_course_progress: {
        Row: {
          completion_date: string | null
          course_id: number
          created_at: string
          id: string
          is_completed: boolean
          lessons_completed: number
          player_id: string
          updated_at: string
        }
        Insert: {
          completion_date?: string | null
          course_id: number
          created_at?: string
          id?: string
          is_completed?: boolean
          lessons_completed?: number
          player_id: string
          updated_at?: string
        }
        Update: {
          completion_date?: string | null
          course_id?: number
          created_at?: string
          id?: string
          is_completed?: boolean
          lessons_completed?: number
          player_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_course_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "training_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_course_progress_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      player_lesson_progress: {
        Row: {
          created_at: string
          exercises_completed: number
          id: string
          is_completed: boolean
          last_position: string | null
          lesson_id: string
          player_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          exercises_completed?: number
          id?: string
          is_completed?: boolean
          last_position?: string | null
          lesson_id: string
          player_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          exercises_completed?: number
          id?: string
          is_completed?: boolean
          last_position?: string | null
          lesson_id?: string
          player_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "training_lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_lesson_progress_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      player_opening_stats: {
        Row: {
          as_black_draws: number
          as_black_games: number
          as_black_losses: number
          as_black_wins: number
          as_white_draws: number
          as_white_games: number
          as_white_losses: number
          as_white_wins: number
          created_at: string
          id: string
          last_played: string | null
          opening_id: number
          player_id: string
          updated_at: string
        }
        Insert: {
          as_black_draws?: number
          as_black_games?: number
          as_black_losses?: number
          as_black_wins?: number
          as_white_draws?: number
          as_white_games?: number
          as_white_losses?: number
          as_white_wins?: number
          created_at?: string
          id?: string
          last_played?: string | null
          opening_id: number
          player_id: string
          updated_at?: string
        }
        Update: {
          as_black_draws?: number
          as_black_games?: number
          as_black_losses?: number
          as_black_wins?: number
          as_white_draws?: number
          as_white_games?: number
          as_white_losses?: number
          as_white_wins?: number
          created_at?: string
          id?: string
          last_played?: string | null
          opening_id?: number
          player_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_opening_stats_opening_id_fkey"
            columns: ["opening_id"]
            isOneToOne: false
            referencedRelation: "chess_openings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_opening_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      player_performance_metrics: {
        Row: {
          accuracy_percentage: number | null
          avg_game_duration_seconds: number | null
          avg_move_time_ms: number | null
          blunder_percentage: number | null
          date: string
          draws: number
          elo_rating: number
          games_played: number
          id: string
          losses: number
          mistake_percentage: number | null
          player_id: string
          wins: number
        }
        Insert: {
          accuracy_percentage?: number | null
          avg_game_duration_seconds?: number | null
          avg_move_time_ms?: number | null
          blunder_percentage?: number | null
          date: string
          draws?: number
          elo_rating: number
          games_played?: number
          id?: string
          losses?: number
          mistake_percentage?: number | null
          player_id: string
          wins?: number
        }
        Update: {
          accuracy_percentage?: number | null
          avg_game_duration_seconds?: number | null
          avg_move_time_ms?: number | null
          blunder_percentage?: number | null
          date?: string
          draws?: number
          elo_rating?: number
          games_played?: number
          id?: string
          losses?: number
          mistake_percentage?: number | null
          player_id?: string
          wins?: number
        }
        Relationships: [
          {
            foreignKeyName: "player_performance_metrics_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      player_puzzle_attempts: {
        Row: {
          created_at: string
          hints_used: number
          id: string
          is_completed: boolean
          moves_attempted: string
          player_id: string
          puzzle_id: string
          rating_change: number | null
          time_taken_seconds: number | null
        }
        Insert: {
          created_at?: string
          hints_used?: number
          id?: string
          is_completed?: boolean
          moves_attempted: string
          player_id: string
          puzzle_id: string
          rating_change?: number | null
          time_taken_seconds?: number | null
        }
        Update: {
          created_at?: string
          hints_used?: number
          id?: string
          is_completed?: boolean
          moves_attempted?: string
          player_id?: string
          puzzle_id?: string
          rating_change?: number | null
          time_taken_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "player_puzzle_attempts_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_puzzle_attempts_puzzle_id_fkey"
            columns: ["puzzle_id"]
            isOneToOne: false
            referencedRelation: "puzzles"
            referencedColumns: ["id"]
          },
        ]
      }
      player_puzzle_stats: {
        Row: {
          created_at: string
          current_streak: number
          id: string
          last_puzzle_date: string | null
          longest_streak: number
          player_id: string
          puzzle_rating: number
          puzzles_attempted: number
          puzzles_completed: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_streak?: number
          id?: string
          last_puzzle_date?: string | null
          longest_streak?: number
          player_id: string
          puzzle_rating?: number
          puzzles_attempted?: number
          puzzles_completed?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_streak?: number
          id?: string
          last_puzzle_date?: string | null
          longest_streak?: number
          player_id?: string
          puzzle_rating?: number
          puzzles_attempted?: number
          puzzles_completed?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_puzzle_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          ban_reason: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          elo_rating: number
          games_drawn: number
          games_lost: number
          games_played: number
          games_won: number
          id: string
          is_admin: boolean
          is_banned: boolean
          last_online: string
          updated_at: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          ban_reason?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          elo_rating?: number
          games_drawn?: number
          games_lost?: number
          games_played?: number
          games_won?: number
          id: string
          is_admin?: boolean
          is_banned?: boolean
          last_online?: string
          updated_at?: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          ban_reason?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          elo_rating?: number
          games_drawn?: number
          games_lost?: number
          games_played?: number
          games_won?: number
          id?: string
          is_admin?: boolean
          is_banned?: boolean
          last_online?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      puzzle_categories: {
        Row: {
          created_at: string
          description: string
          difficulty_level: number
          id: number
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          difficulty_level: number
          id?: number
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          difficulty_level?: number
          id?: number
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      puzzles: {
        Row: {
          category_id: number
          created_at: string
          daily_puzzle_date: string | null
          description: string | null
          difficulty_rating: number
          id: string
          initial_fen: string
          is_daily_puzzle: boolean
          moves: string
          popularity: number
          source: string | null
          success_rate: number
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          category_id: number
          created_at?: string
          daily_puzzle_date?: string | null
          description?: string | null
          difficulty_rating: number
          id?: string
          initial_fen: string
          is_daily_puzzle?: boolean
          moves: string
          popularity?: number
          source?: string | null
          success_rate?: number
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          category_id?: number
          created_at?: string
          daily_puzzle_date?: string | null
          description?: string | null
          difficulty_rating?: number
          id?: string
          initial_fen?: string
          is_daily_puzzle?: boolean
          moves?: string
          popularity?: number
          source?: string | null
          success_rate?: number
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "puzzles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "puzzle_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      shared_analysis: {
        Row: {
          analysis_data: Json
          created_at: string
          description: string | null
          game_id: string | null
          id: string
          imported_game_id: string | null
          is_public: boolean
          pgn: string | null
          title: string
          updated_at: string
          user_id: string
          view_count: number
        }
        Insert: {
          analysis_data: Json
          created_at?: string
          description?: string | null
          game_id?: string | null
          id?: string
          imported_game_id?: string | null
          is_public?: boolean
          pgn?: string | null
          title: string
          updated_at?: string
          user_id: string
          view_count?: number
        }
        Update: {
          analysis_data?: Json
          created_at?: string
          description?: string | null
          game_id?: string | null
          id?: string
          imported_game_id?: string | null
          is_public?: boolean
          pgn?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "shared_analysis_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_analysis_imported_game_id_fkey"
            columns: ["imported_game_id"]
            isOneToOne: false
            referencedRelation: "imported_games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_analysis_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      spectator_views: {
        Row: {
          current_fen: string | null
          current_move_number: number | null
          game_id: string
          id: string
          is_live: boolean
          joined_at: string
          last_activity: string
          spectator_id: string
        }
        Insert: {
          current_fen?: string | null
          current_move_number?: number | null
          game_id: string
          id?: string
          is_live?: boolean
          joined_at?: string
          last_activity?: string
          spectator_id: string
        }
        Update: {
          current_fen?: string | null
          current_move_number?: number | null
          game_id?: string
          id?: string
          is_live?: boolean
          joined_at?: string
          last_activity?: string
          spectator_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "spectator_views_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spectator_views_spectator_id_fkey"
            columns: ["spectator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_matches: {
        Row: {
          black_player_id: string | null
          created_at: string
          game_id: string | null
          id: string
          result: string | null
          round_id: string
          scheduled_time: string | null
          status: string
          tournament_id: string
          updated_at: string
          white_player_id: string | null
          winner_id: string | null
        }
        Insert: {
          black_player_id?: string | null
          created_at?: string
          game_id?: string | null
          id?: string
          result?: string | null
          round_id: string
          scheduled_time?: string | null
          status: string
          tournament_id: string
          updated_at?: string
          white_player_id?: string | null
          winner_id?: string | null
        }
        Update: {
          black_player_id?: string | null
          created_at?: string
          game_id?: string | null
          id?: string
          result?: string | null
          round_id?: string
          scheduled_time?: string | null
          status?: string
          tournament_id?: string
          updated_at?: string
          white_player_id?: string | null
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tournament_matches_black_player_id_fkey"
            columns: ["black_player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_matches_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_matches_round_id_fkey"
            columns: ["round_id"]
            isOneToOne: false
            referencedRelation: "tournament_rounds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_matches_white_player_id_fkey"
            columns: ["white_player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_participants: {
        Row: {
          games_drawn: number
          games_lost: number
          games_played: number
          games_won: number
          id: string
          joined_at: string
          player_id: string
          score: number
          seed: number | null
          status: string
          tournament_id: string
        }
        Insert: {
          games_drawn?: number
          games_lost?: number
          games_played?: number
          games_won?: number
          id?: string
          joined_at?: string
          player_id: string
          score?: number
          seed?: number | null
          status: string
          tournament_id: string
        }
        Update: {
          games_drawn?: number
          games_lost?: number
          games_played?: number
          games_won?: number
          id?: string
          joined_at?: string
          player_id?: string
          score?: number
          seed?: number | null
          status?: string
          tournament_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_participants_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_participants_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_rounds: {
        Row: {
          created_at: string
          end_time: string | null
          id: string
          round_number: number
          start_time: string
          status: string
          tournament_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_time?: string | null
          id?: string
          round_number: number
          start_time: string
          status: string
          tournament_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_time?: string | null
          id?: string
          round_number?: number
          start_time?: string
          status?: string
          tournament_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_rounds_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_types: {
        Row: {
          created_at: string
          description: string
          id: number
          increment_seconds: number
          is_active: boolean
          is_rated: boolean
          name: string
          player_count: number
          rounds_count: number
          time_control_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: number
          increment_seconds?: number
          is_active?: boolean
          is_rated?: boolean
          name: string
          player_count: number
          rounds_count: number
          time_control_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          increment_seconds?: number
          is_active?: boolean
          is_rated?: boolean
          name?: string
          player_count?: number
          rounds_count?: number
          time_control_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      tournaments: {
        Row: {
          chat_room_id: string | null
          created_at: string
          current_participants: number
          description: string | null
          end_time: string | null
          id: string
          is_public: boolean
          max_participants: number
          max_rating: number | null
          min_rating: number | null
          name: string
          organizer_id: string
          registration_deadline: string
          start_time: string
          status: string
          tournament_type_id: number
          updated_at: string
          winner_id: string | null
        }
        Insert: {
          chat_room_id?: string | null
          created_at?: string
          current_participants?: number
          description?: string | null
          end_time?: string | null
          id?: string
          is_public?: boolean
          max_participants: number
          max_rating?: number | null
          min_rating?: number | null
          name: string
          organizer_id: string
          registration_deadline: string
          start_time: string
          status: string
          tournament_type_id: number
          updated_at?: string
          winner_id?: string | null
        }
        Update: {
          chat_room_id?: string | null
          created_at?: string
          current_participants?: number
          description?: string | null
          end_time?: string | null
          id?: string
          is_public?: boolean
          max_participants?: number
          max_rating?: number | null
          min_rating?: number | null
          name?: string
          organizer_id?: string
          registration_deadline?: string
          start_time?: string
          status?: string
          tournament_type_id?: number
          updated_at?: string
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tournaments_chat_room_id_fkey"
            columns: ["chat_room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournaments_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournaments_tournament_type_id_fkey"
            columns: ["tournament_type_id"]
            isOneToOne: false
            referencedRelation: "tournament_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournaments_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      training_courses: {
        Row: {
          cover_image_url: string | null
          created_at: string
          description: string
          difficulty_level: number
          estimated_time_minutes: number
          id: number
          is_active: boolean
          is_premium: boolean
          lessons_count: number
          title: string
          updated_at: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          description: string
          difficulty_level: number
          estimated_time_minutes: number
          id?: number
          is_active?: boolean
          is_premium?: boolean
          lessons_count: number
          title: string
          updated_at?: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          description?: string
          difficulty_level?: number
          estimated_time_minutes?: number
          id?: number
          is_active?: boolean
          is_premium?: boolean
          lessons_count?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      training_lessons: {
        Row: {
          content: string
          course_id: number
          created_at: string
          description: string
          estimated_time_minutes: number
          exercises_required: number
          id: string
          is_active: boolean
          sequence_number: number
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          course_id: number
          created_at?: string
          description: string
          estimated_time_minutes: number
          exercises_required?: number
          id?: string
          is_active?: boolean
          sequence_number: number
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          course_id?: number
          created_at?: string
          description?: string
          estimated_time_minutes?: number
          exercises_required?: number
          id?: string
          is_active?: boolean
          sequence_number?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "training_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achieved_at: string
          achievement_id: number
          id: string
          progress: number
          user_id: string
        }
        Insert: {
          achieved_at?: string
          achievement_id: number
          id?: string
          progress?: number
          user_id: string
        }
        Update: {
          achieved_at?: string
          achievement_id?: number
          id?: string
          progress?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          board_color: string
          created_at: string
          id: string
          notification_settings: Json
          piece_set: string
          privacy_settings: Json
          sound_enabled: boolean
          theme: string
          updated_at: string
        }
        Insert: {
          board_color?: string
          created_at?: string
          id: string
          notification_settings?: Json
          piece_set?: string
          privacy_settings?: Json
          sound_enabled?: boolean
          theme?: string
          updated_at?: string
        }
        Update: {
          board_color?: string
          created_at?: string
          id?: string
          notification_settings?: Json
          piece_set?: string
          privacy_settings?: Json
          sound_enabled?: boolean
          theme?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_id_fkey"
            columns: ["id"]
            isOneToOne: true
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
      create_daily_analytics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_ai_move: {
        Args: {
          game_id: string
          fen_position: string
          difficulty_level: string
          hint_mode?: boolean
        }
        Returns: Json
      }
      get_friends_with_notifications: {
        Args: { p_user_id: string }
        Returns: {
          id: string
          username: string
        }[]
      }
      make_ai_move: {
        Args: { game_id: string }
        Returns: Json
      }
      request_ai_hint: {
        Args: {
          ai_game_session_id: string
          fen_position: string
          hint_type: string
        }
        Returns: Json
      }
      set_daily_puzzle: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      start_ai_game: {
        Args: { player_id: string; difficulty_id: number; player_color: string }
        Returns: string
      }
    }
    Enums: {
      game_status:
        | "waiting_for_players"
        | "in_progress"
        | "completed"
        | "abandoned"
        | "draw"
        | "checkmate"
        | "resignation"
        | "timeout"
      notification_type:
        | "friend_request"
        | "game_challenge"
        | "game_turn"
        | "game_ended"
        | "friend_online"
        | "system_message"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      game_status: [
        "waiting_for_players",
        "in_progress",
        "completed",
        "abandoned",
        "draw",
        "checkmate",
        "resignation",
        "timeout",
      ],
      notification_type: [
        "friend_request",
        "game_challenge",
        "game_turn",
        "game_ended",
        "friend_online",
        "system_message",
      ],
    },
  },
} as const
