export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      agent_feedback: {
        Row: {
          comment: string | null
          created_at: string | null
          helpful: boolean | null
          id: number
          rating: number | null
          session_id: number
          user_id: number
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          helpful?: boolean | null
          id?: number
          rating?: number | null
          session_id: number
          user_id: number
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          helpful?: boolean | null
          id?: number
          rating?: number | null
          session_id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "agent_feedback_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "agent_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_sessions: {
        Row: {
          batch_id: number | null
          created_at: string | null
          farm_id: number | null
          final_recommendation: string | null
          final_risk_level: string | null
          id: number
          messages: Json | null
          title: string | null
          tool_calls_log: Json | null
          updated_at: string | null
          user_id: number
        }
        Insert: {
          batch_id?: number | null
          created_at?: string | null
          farm_id?: number | null
          final_recommendation?: string | null
          final_risk_level?: string | null
          id?: number
          messages?: Json | null
          title?: string | null
          tool_calls_log?: Json | null
          updated_at?: string | null
          user_id: number
        }
        Update: {
          batch_id?: number | null
          created_at?: string | null
          farm_id?: number | null
          final_recommendation?: string | null
          final_risk_level?: string | null
          id?: number
          messages?: Json | null
          title?: string | null
          tool_calls_log?: Json | null
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "agent_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_model_versions: {
        Row: {
          accuracy_metrics: Json | null
          created_at: string | null
          download_url: string | null
          file_name: string | null
          file_size_mb: number | null
          id: number
          is_current: boolean | null
          model_name: string
          release_notes: string | null
          released_at: string | null
          version: string
        }
        Insert: {
          accuracy_metrics?: Json | null
          created_at?: string | null
          download_url?: string | null
          file_name?: string | null
          file_size_mb?: number | null
          id?: number
          is_current?: boolean | null
          model_name: string
          release_notes?: string | null
          released_at?: string | null
          version: string
        }
        Update: {
          accuracy_metrics?: Json | null
          created_at?: string | null
          download_url?: string | null
          file_name?: string | null
          file_size_mb?: number | null
          id?: number
          is_current?: boolean | null
          model_name?: string
          release_notes?: string | null
          released_at?: string | null
          version?: string
        }
        Relationships: []
      }
      batches: {
        Row: {
          batch_code: string
          created_at: string | null
          dispatch_date: string | null
          farm_id: number
          hatchery_id: number
          id: number
          invoice_number: string | null
          invoice_quantity: number | null
          is_stocked: boolean | null
          notes: string | null
          ordered_pl_stage: Database["public"]["Enums"]["pl_stage"] | null
          ordered_quantity: number | null
          pond_id: number | null
          received_date: string | null
          stocked_at: string | null
        }
        Insert: {
          batch_code: string
          created_at?: string | null
          dispatch_date?: string | null
          farm_id: number
          hatchery_id: number
          id?: number
          invoice_number?: string | null
          invoice_quantity?: number | null
          is_stocked?: boolean | null
          notes?: string | null
          ordered_pl_stage?: Database["public"]["Enums"]["pl_stage"] | null
          ordered_quantity?: number | null
          pond_id?: number | null
          received_date?: string | null
          stocked_at?: string | null
        }
        Update: {
          batch_code?: string
          created_at?: string | null
          dispatch_date?: string | null
          farm_id?: number
          hatchery_id?: number
          id?: number
          invoice_number?: string | null
          invoice_quantity?: number | null
          is_stocked?: boolean | null
          notes?: string | null
          ordered_pl_stage?: Database["public"]["Enums"]["pl_stage"] | null
          ordered_quantity?: number | null
          pond_id?: number | null
          received_date?: string | null
          stocked_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "batches_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "batches_hatchery_id_fkey"
            columns: ["hatchery_id"]
            isOneToOne: false
            referencedRelation: "hatcheries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "batches_pond_id_fkey"
            columns: ["pond_id"]
            isOneToOne: false
            referencedRelation: "ponds"
            referencedColumns: ["id"]
          },
        ]
      }
      counting_sessions: {
        Row: {
          batch_id: number
          confidence_interval: number | null
          cv_flag: string | null
          cv_pct: number | null
          dead_count: number | null
          device_id: string | null
          extrapolated_count: number | null
          extrapolated_margin: number | null
          frame_count: number | null
          gps_lat: number | null
          gps_lng: number | null
          id: number
          image_paths: Json | null
          invoice_discrepancy_pct: number | null
          invoice_flag: boolean | null
          invoice_quantity: number | null
          is_split_count: boolean | null
          led_brightness: number | null
          live_count: number | null
          mean_length_mm: number | null
          mortality_alert: Database["public"]["Enums"]["mortality_alert"] | null
          mortality_pct: number | null
          sample_volume_ml: number | null
          session_date: string | null
          split_cv: number | null
          split_mean: number | null
          split_sd: number | null
          split_sub_counts: Json | null
          std_length_mm: number | null
          sync_status: Database["public"]["Enums"]["sync_status"] | null
          synced_at: string | null
          total_count: number | null
          total_volume_ml: number | null
          vle_id: number
        }
        Insert: {
          batch_id: number
          confidence_interval?: number | null
          cv_flag?: string | null
          cv_pct?: number | null
          dead_count?: number | null
          device_id?: string | null
          extrapolated_count?: number | null
          extrapolated_margin?: number | null
          frame_count?: number | null
          gps_lat?: number | null
          gps_lng?: number | null
          id?: number
          image_paths?: Json | null
          invoice_discrepancy_pct?: number | null
          invoice_flag?: boolean | null
          invoice_quantity?: number | null
          is_split_count?: boolean | null
          led_brightness?: number | null
          live_count?: number | null
          mean_length_mm?: number | null
          mortality_alert?:
            | Database["public"]["Enums"]["mortality_alert"]
            | null
          mortality_pct?: number | null
          sample_volume_ml?: number | null
          session_date?: string | null
          split_cv?: number | null
          split_mean?: number | null
          split_sd?: number | null
          split_sub_counts?: Json | null
          std_length_mm?: number | null
          sync_status?: Database["public"]["Enums"]["sync_status"] | null
          synced_at?: string | null
          total_count?: number | null
          total_volume_ml?: number | null
          vle_id: number
        }
        Update: {
          batch_id?: number
          confidence_interval?: number | null
          cv_flag?: string | null
          cv_pct?: number | null
          dead_count?: number | null
          device_id?: string | null
          extrapolated_count?: number | null
          extrapolated_margin?: number | null
          frame_count?: number | null
          gps_lat?: number | null
          gps_lng?: number | null
          id?: number
          image_paths?: Json | null
          invoice_discrepancy_pct?: number | null
          invoice_flag?: boolean | null
          invoice_quantity?: number | null
          is_split_count?: boolean | null
          led_brightness?: number | null
          live_count?: number | null
          mean_length_mm?: number | null
          mortality_alert?:
            | Database["public"]["Enums"]["mortality_alert"]
            | null
          mortality_pct?: number | null
          sample_volume_ml?: number | null
          session_date?: string | null
          split_cv?: number | null
          split_mean?: number | null
          split_sd?: number | null
          split_sub_counts?: Json | null
          std_length_mm?: number | null
          sync_status?: Database["public"]["Enums"]["sync_status"] | null
          synced_at?: string | null
          total_count?: number | null
          total_volume_ml?: number | null
          vle_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "counting_sessions_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "counting_sessions_vle_id_fkey"
            columns: ["vle_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnosis_sessions: {
        Row: {
          ahpnd_prob: number | null
          batch_id: number
          bgd_prob: number | null
          camera_mode: string | null
          device_id: string | null
          ehp_healthy_prob: number | null
          ehp_positive_prob: number | null
          ehp_prob: number | null
          ehp_suspected_prob: number | null
          gps_lat: number | null
          gps_lng: number | null
          gradcam_available: boolean | null
          gradcam_image_path: string | null
          gregarines_prob: number | null
          hard_fail_disease: string | null
          hpv_prob: number | null
          id: number
          image_paths: Json | null
          is_hard_fail: boolean | null
          risk_action_text: string | null
          risk_level: Database["public"]["Enums"]["risk_level"] | null
          session_date: string | null
          spore_boxes: Json | null
          spore_count: number | null
          spore_detected: boolean | null
          spore_severity: Database["public"]["Enums"]["spore_severity"] | null
          sync_status: string | null
          synced_at: string | null
          vle_id: number
          wfs_prob: number | null
          wssv_confidence: number | null
          wssv_positive: boolean | null
        }
        Insert: {
          ahpnd_prob?: number | null
          batch_id: number
          bgd_prob?: number | null
          camera_mode?: string | null
          device_id?: string | null
          ehp_healthy_prob?: number | null
          ehp_positive_prob?: number | null
          ehp_prob?: number | null
          ehp_suspected_prob?: number | null
          gps_lat?: number | null
          gps_lng?: number | null
          gradcam_available?: boolean | null
          gradcam_image_path?: string | null
          gregarines_prob?: number | null
          hard_fail_disease?: string | null
          hpv_prob?: number | null
          id?: number
          image_paths?: Json | null
          is_hard_fail?: boolean | null
          risk_action_text?: string | null
          risk_level?: Database["public"]["Enums"]["risk_level"] | null
          session_date?: string | null
          spore_boxes?: Json | null
          spore_count?: number | null
          spore_detected?: boolean | null
          spore_severity?: Database["public"]["Enums"]["spore_severity"] | null
          sync_status?: string | null
          synced_at?: string | null
          vle_id: number
          wfs_prob?: number | null
          wssv_confidence?: number | null
          wssv_positive?: boolean | null
        }
        Update: {
          ahpnd_prob?: number | null
          batch_id?: number
          bgd_prob?: number | null
          camera_mode?: string | null
          device_id?: string | null
          ehp_healthy_prob?: number | null
          ehp_positive_prob?: number | null
          ehp_prob?: number | null
          ehp_suspected_prob?: number | null
          gps_lat?: number | null
          gps_lng?: number | null
          gradcam_available?: boolean | null
          gradcam_image_path?: string | null
          gregarines_prob?: number | null
          hard_fail_disease?: string | null
          hpv_prob?: number | null
          id?: number
          image_paths?: Json | null
          is_hard_fail?: boolean | null
          risk_action_text?: string | null
          risk_level?: Database["public"]["Enums"]["risk_level"] | null
          session_date?: string | null
          spore_boxes?: Json | null
          spore_count?: number | null
          spore_detected?: boolean | null
          spore_severity?: Database["public"]["Enums"]["spore_severity"] | null
          sync_status?: string | null
          synced_at?: string | null
          vle_id?: number
          wfs_prob?: number | null
          wssv_confidence?: number | null
          wssv_positive?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "diagnosis_sessions_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diagnosis_sessions_vle_id_fkey"
            columns: ["vle_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      farms: {
        Row: {
          created_at: string | null
          district: string | null
          id: number
          is_active: boolean | null
          location_lat: number | null
          location_lng: number | null
          mandal: string | null
          name: string
          owner_id: number
          total_area_hectares: number | null
          village: string | null
          vle_id: number | null
        }
        Insert: {
          created_at?: string | null
          district?: string | null
          id?: number
          is_active?: boolean | null
          location_lat?: number | null
          location_lng?: number | null
          mandal?: string | null
          name: string
          owner_id: number
          total_area_hectares?: number | null
          village?: string | null
          vle_id?: number | null
        }
        Update: {
          created_at?: string | null
          district?: string | null
          id?: number
          is_active?: boolean | null
          location_lat?: number | null
          location_lng?: number | null
          mandal?: string | null
          name?: string
          owner_id?: number
          total_area_hectares?: number | null
          village?: string | null
          vle_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "farms_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farms_vle_id_fkey"
            columns: ["vle_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      grading_sessions: {
        Row: {
          activity_score: number | null
          activity_score_visual: number | null
          appendage_score: number | null
          batch_id: number
          body_colour_score: number | null
          composite_grade: Database["public"]["Enums"]["quality_grade"] | null
          composite_score: number | null
          count_discrepancy_pct: number | null
          count_mismatch: boolean | null
          cv_pct: number | null
          detected_pl_stage: string | null
          device_id: string | null
          disease_score: number | null
          gps_lat: number | null
          gps_lng: number | null
          gut_visibility_score: number | null
          hard_fail_reason: string | null
          id: number
          image_paths: Json | null
          is_hard_fail: boolean | null
          mismatch_evidence_path: string | null
          planned_density_per_sqm: number | null
          posture_score: number | null
          recommended_density_pct: number | null
          recommended_density_per_sqm: number | null
          session_date: string | null
          size_histogram_data: Json | null
          size_histogram_image_path: string | null
          size_uniformity_score: number | null
          stage_confidence: number | null
          stage_mismatch: boolean | null
          stage_mismatch_levels: number | null
          stage_score: number | null
          stocking_recommendation: string | null
          sync_status: string | null
          synced_at: string | null
          tail_muscle_score: number | null
          total_session_minutes: number | null
          visual_health_score: number | null
          vle_id: number
        }
        Insert: {
          activity_score?: number | null
          activity_score_visual?: number | null
          appendage_score?: number | null
          batch_id: number
          body_colour_score?: number | null
          composite_grade?: Database["public"]["Enums"]["quality_grade"] | null
          composite_score?: number | null
          count_discrepancy_pct?: number | null
          count_mismatch?: boolean | null
          cv_pct?: number | null
          detected_pl_stage?: string | null
          device_id?: string | null
          disease_score?: number | null
          gps_lat?: number | null
          gps_lng?: number | null
          gut_visibility_score?: number | null
          hard_fail_reason?: string | null
          id?: number
          image_paths?: Json | null
          is_hard_fail?: boolean | null
          mismatch_evidence_path?: string | null
          planned_density_per_sqm?: number | null
          posture_score?: number | null
          recommended_density_pct?: number | null
          recommended_density_per_sqm?: number | null
          session_date?: string | null
          size_histogram_data?: Json | null
          size_histogram_image_path?: string | null
          size_uniformity_score?: number | null
          stage_confidence?: number | null
          stage_mismatch?: boolean | null
          stage_mismatch_levels?: number | null
          stage_score?: number | null
          stocking_recommendation?: string | null
          sync_status?: string | null
          synced_at?: string | null
          tail_muscle_score?: number | null
          total_session_minutes?: number | null
          visual_health_score?: number | null
          vle_id: number
        }
        Update: {
          activity_score?: number | null
          activity_score_visual?: number | null
          appendage_score?: number | null
          batch_id?: number
          body_colour_score?: number | null
          composite_grade?: Database["public"]["Enums"]["quality_grade"] | null
          composite_score?: number | null
          count_discrepancy_pct?: number | null
          count_mismatch?: boolean | null
          cv_pct?: number | null
          detected_pl_stage?: string | null
          device_id?: string | null
          disease_score?: number | null
          gps_lat?: number | null
          gps_lng?: number | null
          gut_visibility_score?: number | null
          hard_fail_reason?: string | null
          id?: number
          image_paths?: Json | null
          is_hard_fail?: boolean | null
          mismatch_evidence_path?: string | null
          planned_density_per_sqm?: number | null
          posture_score?: number | null
          recommended_density_pct?: number | null
          recommended_density_per_sqm?: number | null
          session_date?: string | null
          size_histogram_data?: Json | null
          size_histogram_image_path?: string | null
          size_uniformity_score?: number | null
          stage_confidence?: number | null
          stage_mismatch?: boolean | null
          stage_mismatch_levels?: number | null
          stage_score?: number | null
          stocking_recommendation?: string | null
          sync_status?: string | null
          synced_at?: string | null
          tail_muscle_score?: number | null
          total_session_minutes?: number | null
          visual_health_score?: number | null
          vle_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "grading_sessions_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grading_sessions_vle_id_fkey"
            columns: ["vle_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      hatcheries: {
        Row: {
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string | null
          district: string | null
          id: number
          is_active: boolean | null
          license_number: string | null
          location_lat: number | null
          location_lng: number | null
          logo_url: string | null
          monthly_pl_volume: number | null
          name: string
          overall_qc_score: number | null
          portal_password_hash: string | null
          state: string | null
          subscription_active: boolean | null
          subscription_expires_at: string | null
          subscription_plan:
            | Database["public"]["Enums"]["subscription_plan"]
            | null
        }
        Insert: {
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          district?: string | null
          id?: number
          is_active?: boolean | null
          license_number?: string | null
          location_lat?: number | null
          location_lng?: number | null
          logo_url?: string | null
          monthly_pl_volume?: number | null
          name: string
          overall_qc_score?: number | null
          portal_password_hash?: string | null
          state?: string | null
          subscription_active?: boolean | null
          subscription_expires_at?: string | null
          subscription_plan?:
            | Database["public"]["Enums"]["subscription_plan"]
            | null
        }
        Update: {
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          district?: string | null
          id?: number
          is_active?: boolean | null
          license_number?: string | null
          location_lat?: number | null
          location_lng?: number | null
          logo_url?: string | null
          monthly_pl_volume?: number | null
          name?: string
          overall_qc_score?: number | null
          portal_password_hash?: string | null
          state?: string | null
          subscription_active?: boolean | null
          subscription_expires_at?: string | null
          subscription_plan?:
            | Database["public"]["Enums"]["subscription_plan"]
            | null
        }
        Relationships: []
      }
      insurance_api_requests: {
        Row: {
          api_key: string
          billed_inr: number | null
          certificate_id: string | null
          company_name: string | null
          endpoint: string | null
          id: number
          requested_at: string | null
          response_status: number | null
        }
        Insert: {
          api_key: string
          billed_inr?: number | null
          certificate_id?: string | null
          company_name?: string | null
          endpoint?: string | null
          id?: number
          requested_at?: string | null
          response_status?: number | null
        }
        Update: {
          api_key?: string
          billed_inr?: number | null
          certificate_id?: string | null
          company_name?: string | null
          endpoint?: string | null
          id?: number
          requested_at?: string | null
          response_status?: number | null
        }
        Relationships: []
      }
      ml_training_jobs: {
        Row: {
          accuracy: number | null
          completed_at: string | null
          count_mape: number | null
          created_at: string | null
          current_epoch: number | null
          error_message: string | null
          f1_score: number | null
          id: number
          logs: Json | null
          map50: number | null
          model_name: string
          new_model_version: string | null
          precision: number | null
          progress_pct: number | null
          promoted_to_production: boolean | null
          recall: number | null
          started_at: string | null
          status: Database["public"]["Enums"]["job_status"] | null
          test_samples: number | null
          total_epochs: number | null
          train_loss: number | null
          training_samples: number | null
          trigger: string | null
          triggered_by: number | null
          val_loss: number | null
          validation_samples: number | null
        }
        Insert: {
          accuracy?: number | null
          completed_at?: string | null
          count_mape?: number | null
          created_at?: string | null
          current_epoch?: number | null
          error_message?: string | null
          f1_score?: number | null
          id?: number
          logs?: Json | null
          map50?: number | null
          model_name: string
          new_model_version?: string | null
          precision?: number | null
          progress_pct?: number | null
          promoted_to_production?: boolean | null
          recall?: number | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["job_status"] | null
          test_samples?: number | null
          total_epochs?: number | null
          train_loss?: number | null
          training_samples?: number | null
          trigger?: string | null
          triggered_by?: number | null
          val_loss?: number | null
          validation_samples?: number | null
        }
        Update: {
          accuracy?: number | null
          completed_at?: string | null
          count_mape?: number | null
          created_at?: string | null
          current_epoch?: number | null
          error_message?: string | null
          f1_score?: number | null
          id?: number
          logs?: Json | null
          map50?: number | null
          model_name?: string
          new_model_version?: string | null
          precision?: number | null
          progress_pct?: number | null
          promoted_to_production?: boolean | null
          recall?: number | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["job_status"] | null
          test_samples?: number | null
          total_epochs?: number | null
          train_loss?: number | null
          training_samples?: number | null
          trigger?: string | null
          triggered_by?: number | null
          val_loss?: number | null
          validation_samples?: number | null
        }
        Relationships: []
      }
      model_evaluations: {
        Row: {
          accuracy: number | null
          class_report: Json | null
          confusion_matrix: Json | null
          count_mape: number | null
          created_at: string | null
          evaluated_by: number | null
          f1_score: number | null
          id: number
          map50: number | null
          model_name: string
          model_version: string
          notes: string | null
          precision: number | null
          recall: number | null
          test_set_size: number | null
        }
        Insert: {
          accuracy?: number | null
          class_report?: Json | null
          confusion_matrix?: Json | null
          count_mape?: number | null
          created_at?: string | null
          evaluated_by?: number | null
          f1_score?: number | null
          id?: number
          map50?: number | null
          model_name: string
          model_version: string
          notes?: string | null
          precision?: number | null
          recall?: number | null
          test_set_size?: number | null
        }
        Update: {
          accuracy?: number | null
          class_report?: Json | null
          confusion_matrix?: Json | null
          count_mape?: number | null
          created_at?: string | null
          evaluated_by?: number | null
          f1_score?: number | null
          id?: number
          map50?: number | null
          model_name?: string
          model_version?: string
          notes?: string | null
          precision?: number | null
          recall?: number | null
          test_set_size?: number | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: number
          source: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: number
          source?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: number
          source?: string
        }
        Relationships: []
      }
      outbreak_alerts: {
        Row: {
          alert_sent_fcm: boolean | null
          alert_sent_whatsapp: boolean | null
          created_at: string | null
          diagnosis_session_id: number
          disease: string
          district: string | null
          id: number
          location_lat: number
          location_lng: number
          mandal: string | null
          notified_farm_ids: Json | null
          notified_farms_count: number | null
          notified_vle_ids: Json | null
          radius_km: number | null
          severity: string | null
        }
        Insert: {
          alert_sent_fcm?: boolean | null
          alert_sent_whatsapp?: boolean | null
          created_at?: string | null
          diagnosis_session_id: number
          disease: string
          district?: string | null
          id?: number
          location_lat: number
          location_lng: number
          mandal?: string | null
          notified_farm_ids?: Json | null
          notified_farms_count?: number | null
          notified_vle_ids?: Json | null
          radius_km?: number | null
          severity?: string | null
        }
        Update: {
          alert_sent_fcm?: boolean | null
          alert_sent_whatsapp?: boolean | null
          created_at?: string | null
          diagnosis_session_id?: number
          disease?: string
          district?: string | null
          id?: number
          location_lat?: number
          location_lng?: number
          mandal?: string | null
          notified_farm_ids?: Json | null
          notified_farms_count?: number | null
          notified_vle_ids?: Json | null
          radius_km?: number | null
          severity?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "outbreak_alerts_diagnosis_session_id_fkey"
            columns: ["diagnosis_session_id"]
            isOneToOne: false
            referencedRelation: "diagnosis_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      pcr_feedback: {
        Row: {
          ai_was_correct: boolean | null
          ct_value: number | null
          diagnosis_session_id: number
          farmer_id: number
          feedback_date: string | null
          id: number
          lab_name: string | null
          pcr_result: string
          training_priority: string | null
          used_in_training: boolean | null
        }
        Insert: {
          ai_was_correct?: boolean | null
          ct_value?: number | null
          diagnosis_session_id: number
          farmer_id: number
          feedback_date?: string | null
          id?: number
          lab_name?: string | null
          pcr_result: string
          training_priority?: string | null
          used_in_training?: boolean | null
        }
        Update: {
          ai_was_correct?: boolean | null
          ct_value?: number | null
          diagnosis_session_id?: number
          farmer_id?: number
          feedback_date?: string | null
          id?: number
          lab_name?: string | null
          pcr_result?: string
          training_priority?: string | null
          used_in_training?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "pcr_feedback_diagnosis_session_id_fkey"
            columns: ["diagnosis_session_id"]
            isOneToOne: false
            referencedRelation: "diagnosis_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pcr_feedback_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ponds: {
        Row: {
          area_sqm: number | null
          created_at: string | null
          depth_m: number | null
          farm_id: number
          id: number
          is_active: boolean | null
          name: string
        }
        Insert: {
          area_sqm?: number | null
          created_at?: string | null
          depth_m?: number | null
          farm_id: number
          id?: number
          is_active?: boolean | null
          name: string
        }
        Update: {
          area_sqm?: number | null
          created_at?: string | null
          depth_m?: number | null
          farm_id?: number
          id?: number
          is_active?: boolean | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "ponds_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_ponds: {
        Row: {
          area_sqm: number | null
          created_at: string
          depth_m: number | null
          id: string
          name: string
          profile_id: string
        }
        Insert: {
          area_sqm?: number | null
          created_at?: string
          depth_m?: number | null
          id?: string
          name: string
          profile_id: string
        }
        Update: {
          area_sqm?: number | null
          created_at?: string
          depth_m?: number | null
          id?: string
          name?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_ponds_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          dob: string | null
          full_name: string | null
          id: string
          location: string | null
          mobile: string | null
          ponds_count: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          dob?: string | null
          full_name?: string | null
          id: string
          location?: string | null
          mobile?: string | null
          ponds_count?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          dob?: string | null
          full_name?: string | null
          id?: string
          location?: string | null
          mobile?: string | null
          ponds_count?: number
          updated_at?: string
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string
          endpoint: string
          id: string
          p256dh: string
          updated_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string
          endpoint: string
          id?: string
          p256dh: string
          updated_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string
          endpoint?: string
          id?: string
          p256dh?: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      qc_certificates: {
        Row: {
          batch_id: number | null
          certificate_data: Json | null
          certificate_id: string
          composite_score: number | null
          counting_session_id: number | null
          created_at: string | null
          diagnosis_session_id: number | null
          expires_at: string | null
          farm_name: string | null
          grade: string | null
          grading_session_id: number | null
          hatchery_name: string | null
          hmac_hash: string | null
          id: number
          is_hard_fail: boolean | null
          is_revoked: boolean | null
          is_valid: boolean | null
          language: string | null
          pdf_path: string | null
          qr_code_path: string | null
          revoked_reason: string | null
          session_type: string
          vle_name: string | null
        }
        Insert: {
          batch_id?: number | null
          certificate_data?: Json | null
          certificate_id: string
          composite_score?: number | null
          counting_session_id?: number | null
          created_at?: string | null
          diagnosis_session_id?: number | null
          expires_at?: string | null
          farm_name?: string | null
          grade?: string | null
          grading_session_id?: number | null
          hatchery_name?: string | null
          hmac_hash?: string | null
          id?: number
          is_hard_fail?: boolean | null
          is_revoked?: boolean | null
          is_valid?: boolean | null
          language?: string | null
          pdf_path?: string | null
          qr_code_path?: string | null
          revoked_reason?: string | null
          session_type: string
          vle_name?: string | null
        }
        Update: {
          batch_id?: number | null
          certificate_data?: Json | null
          certificate_id?: string
          composite_score?: number | null
          counting_session_id?: number | null
          created_at?: string | null
          diagnosis_session_id?: number | null
          expires_at?: string | null
          farm_name?: string | null
          grade?: string | null
          grading_session_id?: number | null
          hatchery_name?: string | null
          hmac_hash?: string | null
          id?: number
          is_hard_fail?: boolean | null
          is_revoked?: boolean | null
          is_valid?: boolean | null
          language?: string | null
          pdf_path?: string | null
          qr_code_path?: string | null
          revoked_reason?: string | null
          session_type?: string
          vle_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "qc_certificates_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qc_certificates_counting_session_id_fkey"
            columns: ["counting_session_id"]
            isOneToOne: false
            referencedRelation: "counting_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qc_certificates_diagnosis_session_id_fkey"
            columns: ["diagnosis_session_id"]
            isOneToOne: false
            referencedRelation: "diagnosis_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qc_certificates_grading_session_id_fkey"
            columns: ["grading_session_id"]
            isOneToOne: false
            referencedRelation: "grading_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          billing_details: Json | null
          cancelled_at: string | null
          created_at: string | null
          credits_remaining: number | null
          expires_at: string | null
          hatchery_id: number | null
          id: number
          monthly_price_inr: number | null
          plan_type: Database["public"]["Enums"]["plan_type"]
          started_at: string | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          tests_used_this_month: number | null
          user_id: number | null
        }
        Insert: {
          billing_details?: Json | null
          cancelled_at?: string | null
          created_at?: string | null
          credits_remaining?: number | null
          expires_at?: string | null
          hatchery_id?: number | null
          id?: number
          monthly_price_inr?: number | null
          plan_type: Database["public"]["Enums"]["plan_type"]
          started_at?: string | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          tests_used_this_month?: number | null
          user_id?: number | null
        }
        Update: {
          billing_details?: Json | null
          cancelled_at?: string | null
          created_at?: string | null
          credits_remaining?: number | null
          expires_at?: string | null
          hatchery_id?: number | null
          id?: number
          monthly_price_inr?: number | null
          plan_type?: Database["public"]["Enums"]["plan_type"]
          started_at?: string | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          tests_used_this_month?: number | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_hatchery_id_fkey"
            columns: ["hatchery_id"]
            isOneToOne: false
            referencedRelation: "hatcheries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_queue: {
        Row: {
          created_at: string | null
          device_id: string
          error_message: string | null
          id: number
          retry_count: number | null
          session_data: Json
          session_type: string
          status: string | null
          synced_at: string | null
          user_id: number
        }
        Insert: {
          created_at?: string | null
          device_id: string
          error_message?: string | null
          id?: number
          retry_count?: number | null
          session_data: Json
          session_type: string
          status?: string | null
          synced_at?: string | null
          user_id: number
        }
        Update: {
          created_at?: string | null
          device_id?: string
          error_message?: string | null
          id?: number
          retry_count?: number | null
          session_data?: Json
          session_type?: string
          status?: string | null
          synced_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "sync_queue_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      test_credits: {
        Row: {
          credits_purchased: number
          credits_used: number | null
          id: number
          price_paid_inr: number | null
          purchased_at: string | null
          user_id: number
        }
        Insert: {
          credits_purchased: number
          credits_used?: number | null
          id?: number
          price_paid_inr?: number | null
          purchased_at?: string | null
          user_id: number
        }
        Update: {
          credits_purchased?: number
          credits_used?: number | null
          id?: number
          price_paid_inr?: number | null
          purchased_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "test_credits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      training_data_submissions: {
        Row: {
          annotation_data: Json | null
          approved_at: string | null
          farm_id: number | null
          gps_lat: number | null
          gps_lng: number | null
          ground_truth_label: string | null
          ground_truth_source: string | null
          id: number
          image_path: string
          is_approved: boolean | null
          is_used_in_training: boolean | null
          model_target: string
          pcr_ct_value: number | null
          quality_score: number | null
          submitted_at: string | null
          submitted_by: number
          training_batch_id: string | null
        }
        Insert: {
          annotation_data?: Json | null
          approved_at?: string | null
          farm_id?: number | null
          gps_lat?: number | null
          gps_lng?: number | null
          ground_truth_label?: string | null
          ground_truth_source?: string | null
          id?: number
          image_path: string
          is_approved?: boolean | null
          is_used_in_training?: boolean | null
          model_target: string
          pcr_ct_value?: number | null
          quality_score?: number | null
          submitted_at?: string | null
          submitted_by: number
          training_batch_id?: string | null
        }
        Update: {
          annotation_data?: Json | null
          approved_at?: string | null
          farm_id?: number | null
          gps_lat?: number | null
          gps_lng?: number | null
          ground_truth_label?: string | null
          ground_truth_source?: string | null
          id?: number
          image_path?: string
          is_approved?: boolean | null
          is_used_in_training?: boolean | null
          model_target?: string
          pcr_ct_value?: number | null
          quality_score?: number | null
          submitted_at?: string | null
          submitted_by?: number
          training_batch_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "training_data_submissions_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_data_submissions_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          cluster_id: string | null
          created_at: string | null
          district: string | null
          email: string
          fcm_token: string | null
          hashed_password: string
          id: number
          is_active: boolean | null
          language: Database["public"]["Enums"]["language"]
          mandal: string | null
          name: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          cluster_id?: string | null
          created_at?: string | null
          district?: string | null
          email: string
          fcm_token?: string | null
          hashed_password: string
          id?: number
          is_active?: boolean | null
          language?: Database["public"]["Enums"]["language"]
          mandal?: string | null
          name: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          cluster_id?: string | null
          created_at?: string | null
          district?: string | null
          email?: string
          fcm_token?: string | null
          hashed_password?: string
          id?: number
          is_active?: boolean | null
          language?: Database["public"]["Enums"]["language"]
          mandal?: string | null
          name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      water_quality_readings: {
        Row: {
          alert_details: string | null
          alkalinity_mgl: number | null
          ammonia_mgl: number | null
          any_alert: boolean | null
          dissolved_oxygen_mgl: number | null
          farm_id: number
          id: number
          nitrite_mgl: number | null
          ph: number | null
          pond_id: number | null
          recorded_at: string | null
          recorded_by: number | null
          salinity_ppt: number | null
          sensor_id: string | null
          source: string | null
          temperature_c: number | null
          turbidity_ntu: number | null
        }
        Insert: {
          alert_details?: string | null
          alkalinity_mgl?: number | null
          ammonia_mgl?: number | null
          any_alert?: boolean | null
          dissolved_oxygen_mgl?: number | null
          farm_id: number
          id?: number
          nitrite_mgl?: number | null
          ph?: number | null
          pond_id?: number | null
          recorded_at?: string | null
          recorded_by?: number | null
          salinity_ppt?: number | null
          sensor_id?: string | null
          source?: string | null
          temperature_c?: number | null
          turbidity_ntu?: number | null
        }
        Update: {
          alert_details?: string | null
          alkalinity_mgl?: number | null
          ammonia_mgl?: number | null
          any_alert?: boolean | null
          dissolved_oxygen_mgl?: number | null
          farm_id?: number
          id?: number
          nitrite_mgl?: number | null
          ph?: number | null
          pond_id?: number | null
          recorded_at?: string | null
          recorded_by?: number | null
          salinity_ppt?: number | null
          sensor_id?: string | null
          source?: string | null
          temperature_c?: number | null
          turbidity_ntu?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "water_quality_readings_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "water_quality_readings_pond_id_fkey"
            columns: ["pond_id"]
            isOneToOne: false
            referencedRelation: "ponds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "water_quality_readings_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "users"
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
      job_status: "queued" | "running" | "completed" | "failed" | "cancelled"
      language: "english" | "telugu" | "tamil" | "odia"
      mortality_alert: "green" | "yellow" | "red"
      pl_stage: "PL5" | "PL8" | "PL10" | "PL12" | "PL15+"
      plan_type:
        | "farmer_monthly"
        | "farmer_annual"
        | "per_test"
        | "hatchery_basic"
        | "hatchery_standard"
        | "hatchery_premium"
        | "vle_franchise"
        | "insurance_api"
        | "govt_surveillance"
      quality_grade: "PREMIUM" | "GOOD" | "CONDITIONAL" | "CAUTION" | "REJECT"
      risk_level: "green" | "yellow" | "red" | "grey"
      spore_severity: "low" | "moderate" | "high"
      subscription_plan: "basic" | "standard" | "premium"
      subscription_status: "active" | "expired" | "cancelled" | "trial"
      sync_status: "pending" | "synced" | "failed"
      user_role:
        | "farmer"
        | "vle"
        | "hatchery_manager"
        | "farm_supervisor"
        | "govt_officer"
        | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      job_status: ["queued", "running", "completed", "failed", "cancelled"],
      language: ["english", "telugu", "tamil", "odia"],
      mortality_alert: ["green", "yellow", "red"],
      pl_stage: ["PL5", "PL8", "PL10", "PL12", "PL15+"],
      plan_type: [
        "farmer_monthly",
        "farmer_annual",
        "per_test",
        "hatchery_basic",
        "hatchery_standard",
        "hatchery_premium",
        "vle_franchise",
        "insurance_api",
        "govt_surveillance",
      ],
      quality_grade: ["PREMIUM", "GOOD", "CONDITIONAL", "CAUTION", "REJECT"],
      risk_level: ["green", "yellow", "red", "grey"],
      spore_severity: ["low", "moderate", "high"],
      subscription_plan: ["basic", "standard", "premium"],
      subscription_status: ["active", "expired", "cancelled", "trial"],
      sync_status: ["pending", "synced", "failed"],
      user_role: [
        "farmer",
        "vle",
        "hatchery_manager",
        "farm_supervisor",
        "govt_officer",
        "admin",
      ],
    },
  },
} as const
