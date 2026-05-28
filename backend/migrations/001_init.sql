-- Aqua AI initial schema (from backend/app/models/*.py)
-- Targets Postgres 17 (Supabase). RLS is enabled on every public table.
-- Backend connects via service_role key, which bypasses RLS, so empty
-- policies are safe for now; tighten with per-row checks when auth is wired.

-- ── Enums ────────────────────────────────────────────────────────────────
CREATE TYPE user_role AS ENUM (
  'farmer', 'vle', 'hatchery_manager', 'farm_supervisor', 'govt_officer', 'admin'
);
CREATE TYPE language AS ENUM ('english', 'telugu', 'tamil', 'odia');
CREATE TYPE pl_stage AS ENUM ('PL5', 'PL8', 'PL10', 'PL12', 'PL15+');
CREATE TYPE mortality_alert AS ENUM ('green', 'yellow', 'red');
CREATE TYPE sync_status AS ENUM ('pending', 'synced', 'failed');
CREATE TYPE risk_level AS ENUM ('green', 'yellow', 'red', 'grey');
CREATE TYPE spore_severity AS ENUM ('low', 'moderate', 'high');
CREATE TYPE quality_grade AS ENUM (
  'PREMIUM', 'GOOD', 'CONDITIONAL', 'CAUTION', 'REJECT'
);
CREATE TYPE subscription_plan AS ENUM ('basic', 'standard', 'premium');
CREATE TYPE plan_type AS ENUM (
  'farmer_monthly', 'farmer_annual', 'per_test',
  'hatchery_basic', 'hatchery_standard', 'hatchery_premium',
  'vle_franchise', 'insurance_api', 'govt_surveillance'
);
CREATE TYPE subscription_status AS ENUM ('active', 'expired', 'cancelled', 'trial');
CREATE TYPE job_status AS ENUM ('queued', 'running', 'completed', 'failed', 'cancelled');

-- ── Core identity ────────────────────────────────────────────────────────
CREATE TABLE users (
  id                 SERIAL PRIMARY KEY,
  name               VARCHAR(255) NOT NULL,
  email              VARCHAR(255) UNIQUE NOT NULL,
  phone              VARCHAR(20)  UNIQUE,
  hashed_password    VARCHAR(255) NOT NULL,
  role               user_role    NOT NULL DEFAULT 'farmer',
  language           language     NOT NULL DEFAULT 'english',
  district           VARCHAR(100),
  mandal             VARCHAR(100),
  cluster_id         VARCHAR(50),
  is_active          BOOLEAN      DEFAULT TRUE,
  fcm_token          TEXT,
  created_at         TIMESTAMPTZ  DEFAULT NOW(),
  updated_at         TIMESTAMPTZ
);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);

-- ── Locations & batches ──────────────────────────────────────────────────
CREATE TABLE farms (
  id                  SERIAL PRIMARY KEY,
  name                VARCHAR(255) NOT NULL,
  owner_id            INTEGER NOT NULL REFERENCES users(id),
  vle_id              INTEGER REFERENCES users(id),
  location_lat        DOUBLE PRECISION,
  location_lng        DOUBLE PRECISION,
  district            VARCHAR(100),
  mandal              VARCHAR(100),
  village             VARCHAR(100),
  total_area_hectares DOUBLE PRECISION,
  is_active           BOOLEAN DEFAULT TRUE,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ponds (
  id         SERIAL PRIMARY KEY,
  farm_id    INTEGER NOT NULL REFERENCES farms(id),
  name       VARCHAR(100) NOT NULL,
  area_sqm   DOUBLE PRECISION,
  depth_m    DOUBLE PRECISION,
  is_active  BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE hatcheries (
  id                       SERIAL PRIMARY KEY,
  name                     VARCHAR(255) NOT NULL,
  contact_name             VARCHAR(255),
  contact_phone            VARCHAR(20),
  contact_email            VARCHAR(255),
  location_lat             DOUBLE PRECISION,
  location_lng             DOUBLE PRECISION,
  district                 VARCHAR(100),
  state                    VARCHAR(100),
  license_number           VARCHAR(100),
  subscription_plan        subscription_plan DEFAULT 'basic',
  subscription_active      BOOLEAN DEFAULT FALSE,
  subscription_expires_at  TIMESTAMPTZ,
  monthly_pl_volume        INTEGER,
  logo_url                 TEXT,
  portal_password_hash     VARCHAR(255),
  overall_qc_score         DOUBLE PRECISION,
  is_active                BOOLEAN DEFAULT TRUE,
  created_at               TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE batches (
  id                  SERIAL PRIMARY KEY,
  batch_code          VARCHAR(100) UNIQUE NOT NULL,
  hatchery_id         INTEGER NOT NULL REFERENCES hatcheries(id),
  farm_id             INTEGER NOT NULL REFERENCES farms(id),
  pond_id             INTEGER REFERENCES ponds(id),
  ordered_pl_stage    pl_stage,
  ordered_quantity    INTEGER,
  invoice_number      VARCHAR(100),
  invoice_quantity    INTEGER,
  dispatch_date       TIMESTAMPTZ,
  received_date       TIMESTAMPTZ,
  notes               TEXT,
  is_stocked          BOOLEAN DEFAULT FALSE,
  stocked_at          TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_batches_batch_code ON batches(batch_code);

-- ── AI session tables ────────────────────────────────────────────────────
CREATE TABLE counting_sessions (
  id                    SERIAL PRIMARY KEY,
  batch_id              INTEGER NOT NULL REFERENCES batches(id),
  vle_id                INTEGER NOT NULL REFERENCES users(id),
  session_date          TIMESTAMPTZ DEFAULT NOW(),
  gps_lat               DOUBLE PRECISION,
  gps_lng               DOUBLE PRECISION,
  led_brightness        INTEGER DEFAULT 3,
  frame_count           INTEGER DEFAULT 3,
  image_paths           JSONB   DEFAULT '[]'::jsonb,
  live_count            INTEGER,
  dead_count            INTEGER,
  total_count           INTEGER,
  mortality_pct         DOUBLE PRECISION,
  mortality_alert       mortality_alert,
  cv_pct                DOUBLE PRECISION,
  mean_length_mm        DOUBLE PRECISION,
  std_length_mm         DOUBLE PRECISION,
  cv_flag               VARCHAR(20),
  sample_volume_ml      DOUBLE PRECISION,
  total_volume_ml       DOUBLE PRECISION,
  extrapolated_count    INTEGER,
  extrapolated_margin   INTEGER,
  invoice_quantity      INTEGER,
  invoice_discrepancy_pct DOUBLE PRECISION,
  invoice_flag          BOOLEAN DEFAULT FALSE,
  is_split_count        BOOLEAN DEFAULT FALSE,
  split_sub_counts      JSONB,
  split_mean            DOUBLE PRECISION,
  split_sd              DOUBLE PRECISION,
  split_cv              DOUBLE PRECISION,
  confidence_interval   INTEGER,
  sync_status           sync_status DEFAULT 'pending',
  device_id             VARCHAR(100),
  synced_at             TIMESTAMPTZ
);

CREATE TABLE diagnosis_sessions (
  id                  SERIAL PRIMARY KEY,
  batch_id            INTEGER NOT NULL REFERENCES batches(id),
  vle_id              INTEGER NOT NULL REFERENCES users(id),
  session_date        TIMESTAMPTZ DEFAULT NOW(),
  gps_lat             DOUBLE PRECISION,
  gps_lng             DOUBLE PRECISION,
  image_paths         JSONB DEFAULT '[]'::jsonb,
  camera_mode         VARCHAR(20) DEFAULT 'software_mono',
  ehp_prob            DOUBLE PRECISION,
  ehp_healthy_prob    DOUBLE PRECISION,
  ehp_suspected_prob  DOUBLE PRECISION,
  ehp_positive_prob   DOUBLE PRECISION,
  spore_detected      BOOLEAN DEFAULT FALSE,
  spore_count         INTEGER,
  spore_severity      spore_severity,
  spore_boxes         JSONB,
  wssv_positive       BOOLEAN DEFAULT FALSE,
  wssv_confidence     DOUBLE PRECISION,
  ahpnd_prob          DOUBLE PRECISION,
  bgd_prob            DOUBLE PRECISION,
  hpv_prob            DOUBLE PRECISION,
  gregarines_prob     DOUBLE PRECISION,
  wfs_prob            DOUBLE PRECISION,
  is_hard_fail        BOOLEAN DEFAULT FALSE,
  hard_fail_disease   VARCHAR(50),
  gradcam_available   BOOLEAN DEFAULT FALSE,
  gradcam_image_path  TEXT,
  risk_level          risk_level,
  risk_action_text    TEXT,
  sync_status         VARCHAR(20) DEFAULT 'pending',
  device_id           VARCHAR(100),
  synced_at           TIMESTAMPTZ
);

CREATE TABLE pcr_feedback (
  id                     SERIAL PRIMARY KEY,
  diagnosis_session_id   INTEGER NOT NULL REFERENCES diagnosis_sessions(id),
  farmer_id              INTEGER NOT NULL REFERENCES users(id),
  pcr_result             VARCHAR(20) NOT NULL,
  ct_value               DOUBLE PRECISION,
  lab_name               VARCHAR(255),
  feedback_date          TIMESTAMPTZ DEFAULT NOW(),
  ai_was_correct         BOOLEAN,
  used_in_training       BOOLEAN DEFAULT FALSE,
  training_priority      VARCHAR(20) DEFAULT 'normal'
);

CREATE TABLE grading_sessions (
  id                            SERIAL PRIMARY KEY,
  batch_id                      INTEGER NOT NULL REFERENCES batches(id),
  vle_id                        INTEGER NOT NULL REFERENCES users(id),
  session_date                  TIMESTAMPTZ DEFAULT NOW(),
  gps_lat                       DOUBLE PRECISION,
  gps_lng                       DOUBLE PRECISION,
  image_paths                   JSONB DEFAULT '[]'::jsonb,
  total_session_minutes         DOUBLE PRECISION,
  composite_score               DOUBLE PRECISION,
  composite_grade               quality_grade,
  is_hard_fail                  BOOLEAN DEFAULT FALSE,
  hard_fail_reason              VARCHAR(100),
  visual_health_score           DOUBLE PRECISION,
  body_colour_score             DOUBLE PRECISION,
  gut_visibility_score          DOUBLE PRECISION,
  tail_muscle_score             DOUBLE PRECISION,
  appendage_score               DOUBLE PRECISION,
  posture_score                 DOUBLE PRECISION,
  activity_score_visual         DOUBLE PRECISION,
  detected_pl_stage             VARCHAR(10),
  stage_confidence              DOUBLE PRECISION,
  stage_score                   DOUBLE PRECISION,
  stage_mismatch                BOOLEAN DEFAULT FALSE,
  stage_mismatch_levels         INTEGER DEFAULT 0,
  size_uniformity_score         DOUBLE PRECISION,
  cv_pct                        DOUBLE PRECISION,
  disease_score                 DOUBLE PRECISION,
  size_histogram_data           JSONB,
  size_histogram_image_path     TEXT,
  activity_score                DOUBLE PRECISION,
  planned_density_per_sqm       DOUBLE PRECISION,
  recommended_density_pct       DOUBLE PRECISION,
  recommended_density_per_sqm   DOUBLE PRECISION,
  stocking_recommendation       TEXT,
  count_mismatch                BOOLEAN DEFAULT FALSE,
  count_discrepancy_pct         DOUBLE PRECISION,
  mismatch_evidence_path        TEXT,
  sync_status                   VARCHAR(20) DEFAULT 'pending',
  device_id                     VARCHAR(100),
  synced_at                     TIMESTAMPTZ
);

CREATE TABLE qc_certificates (
  id                      SERIAL PRIMARY KEY,
  certificate_id          VARCHAR(36) UNIQUE NOT NULL,
  session_type            VARCHAR(30) NOT NULL,
  batch_id                INTEGER REFERENCES batches(id),
  counting_session_id     INTEGER REFERENCES counting_sessions(id),
  diagnosis_session_id    INTEGER REFERENCES diagnosis_sessions(id),
  grading_session_id      INTEGER REFERENCES grading_sessions(id),
  farm_name               VARCHAR(255),
  vle_name                VARCHAR(255),
  hatchery_name           VARCHAR(255),
  composite_score         DOUBLE PRECISION,
  grade                   VARCHAR(20),
  is_hard_fail            BOOLEAN DEFAULT FALSE,
  pdf_path                TEXT,
  qr_code_path            TEXT,
  hmac_hash               VARCHAR(64),
  certificate_data        JSONB,
  language                VARCHAR(20) DEFAULT 'english',
  is_valid                BOOLEAN DEFAULT TRUE,
  is_revoked              BOOLEAN DEFAULT FALSE,
  revoked_reason          TEXT,
  expires_at              TIMESTAMPTZ,
  created_at              TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_qc_certificate_id ON qc_certificates(certificate_id);

-- ── AI model / training tables ───────────────────────────────────────────
CREATE TABLE ai_model_versions (
  id                SERIAL PRIMARY KEY,
  model_name        VARCHAR(50) NOT NULL,
  version           VARCHAR(20) NOT NULL,
  file_name         VARCHAR(255),
  file_size_mb      DOUBLE PRECISION,
  download_url      TEXT,
  release_notes     TEXT,
  accuracy_metrics  JSONB,
  is_current        BOOLEAN DEFAULT FALSE,
  released_at       TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_ai_model_name ON ai_model_versions(model_name);

CREATE TABLE outbreak_alerts (
  id                    SERIAL PRIMARY KEY,
  diagnosis_session_id  INTEGER NOT NULL REFERENCES diagnosis_sessions(id),
  disease               VARCHAR(50) NOT NULL,
  severity              VARCHAR(20),
  location_lat          DOUBLE PRECISION NOT NULL,
  location_lng          DOUBLE PRECISION NOT NULL,
  district              VARCHAR(100),
  mandal                VARCHAR(100),
  radius_km             DOUBLE PRECISION DEFAULT 5.0,
  notified_farm_ids     JSONB DEFAULT '[]'::jsonb,
  notified_vle_ids      JSONB DEFAULT '[]'::jsonb,
  notified_farms_count  INTEGER DEFAULT 0,
  alert_sent_fcm        BOOLEAN DEFAULT FALSE,
  alert_sent_whatsapp   BOOLEAN DEFAULT FALSE,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE water_quality_readings (
  id                    SERIAL PRIMARY KEY,
  farm_id               INTEGER NOT NULL REFERENCES farms(id),
  pond_id               INTEGER REFERENCES ponds(id),
  recorded_by           INTEGER REFERENCES users(id),
  temperature_c         DOUBLE PRECISION,
  salinity_ppt          DOUBLE PRECISION,
  ph                    DOUBLE PRECISION,
  dissolved_oxygen_mgl  DOUBLE PRECISION,
  ammonia_mgl           DOUBLE PRECISION,
  nitrite_mgl           DOUBLE PRECISION,
  alkalinity_mgl        DOUBLE PRECISION,
  turbidity_ntu         DOUBLE PRECISION,
  source                VARCHAR(20) DEFAULT 'manual',
  sensor_id             VARCHAR(100),
  any_alert             BOOLEAN DEFAULT FALSE,
  alert_details         VARCHAR(500),
  recorded_at           TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sync_queue (
  id             SERIAL PRIMARY KEY,
  device_id      VARCHAR(100) NOT NULL,
  user_id        INTEGER NOT NULL REFERENCES users(id),
  session_type   VARCHAR(30) NOT NULL,
  session_data   JSONB NOT NULL,
  status         VARCHAR(20) DEFAULT 'pending',
  retry_count    INTEGER DEFAULT 0,
  error_message  VARCHAR(500),
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  synced_at      TIMESTAMPTZ
);
CREATE INDEX idx_sync_queue_device_id ON sync_queue(device_id);

CREATE TABLE agent_sessions (
  id                    SERIAL PRIMARY KEY,
  user_id               INTEGER NOT NULL REFERENCES users(id),
  title                 TEXT,
  farm_id               INTEGER,
  batch_id              INTEGER,
  messages              JSONB DEFAULT '[]'::jsonb,
  tool_calls_log        JSONB DEFAULT '[]'::jsonb,
  final_risk_level      TEXT,
  final_recommendation  TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE agent_feedback (
  id          SERIAL PRIMARY KEY,
  session_id  INTEGER NOT NULL REFERENCES agent_sessions(id),
  user_id     INTEGER NOT NULL,
  rating      INTEGER,
  helpful     BOOLEAN,
  comment     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ml_training_jobs (
  id                        SERIAL PRIMARY KEY,
  model_name                TEXT NOT NULL,
  trigger                   TEXT DEFAULT 'manual',
  triggered_by              INTEGER,
  status                    job_status DEFAULT 'queued',
  progress_pct              DOUBLE PRECISION DEFAULT 0.0,
  current_epoch             INTEGER DEFAULT 0,
  total_epochs              INTEGER DEFAULT 100,
  training_samples          INTEGER,
  validation_samples        INTEGER,
  test_samples              INTEGER,
  train_loss                DOUBLE PRECISION,
  val_loss                  DOUBLE PRECISION,
  accuracy                  DOUBLE PRECISION,
  precision                 DOUBLE PRECISION,
  recall                    DOUBLE PRECISION,
  f1_score                  DOUBLE PRECISION,
  map50                     DOUBLE PRECISION,
  count_mape                DOUBLE PRECISION,
  new_model_version         TEXT,
  promoted_to_production    BOOLEAN DEFAULT FALSE,
  error_message             TEXT,
  logs                      JSONB DEFAULT '[]'::jsonb,
  started_at                TIMESTAMPTZ,
  completed_at              TIMESTAMPTZ,
  created_at                TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE model_evaluations (
  id                SERIAL PRIMARY KEY,
  model_name        TEXT NOT NULL,
  model_version     TEXT NOT NULL,
  evaluated_by      INTEGER,
  test_set_size     INTEGER,
  accuracy          DOUBLE PRECISION,
  precision         DOUBLE PRECISION,
  recall            DOUBLE PRECISION,
  f1_score          DOUBLE PRECISION,
  map50             DOUBLE PRECISION,
  count_mape        DOUBLE PRECISION,
  confusion_matrix  JSONB,
  class_report      JSONB,
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE training_data_submissions (
  id                    SERIAL PRIMARY KEY,
  submitted_by          INTEGER NOT NULL REFERENCES users(id),
  model_target          VARCHAR(50) NOT NULL,
  image_path            TEXT NOT NULL,
  ground_truth_label    VARCHAR(100),
  ground_truth_source   VARCHAR(50),
  pcr_ct_value          DOUBLE PRECISION,
  annotation_data       JSONB,
  quality_score         DOUBLE PRECISION,
  is_approved           BOOLEAN DEFAULT FALSE,
  is_used_in_training   BOOLEAN DEFAULT FALSE,
  training_batch_id     VARCHAR(50),
  farm_id               INTEGER REFERENCES farms(id),
  gps_lat               DOUBLE PRECISION,
  gps_lng               DOUBLE PRECISION,
  submitted_at          TIMESTAMPTZ DEFAULT NOW(),
  approved_at           TIMESTAMPTZ
);

-- ── Billing ──────────────────────────────────────────────────────────────
CREATE TABLE subscriptions (
  id                       SERIAL PRIMARY KEY,
  user_id                  INTEGER REFERENCES users(id),
  hatchery_id              INTEGER REFERENCES hatcheries(id),
  plan_type                plan_type NOT NULL,
  status                   subscription_status DEFAULT 'trial',
  monthly_price_inr        DOUBLE PRECISION,
  credits_remaining        INTEGER,
  tests_used_this_month    INTEGER DEFAULT 0,
  started_at               TIMESTAMPTZ DEFAULT NOW(),
  expires_at               TIMESTAMPTZ,
  cancelled_at             TIMESTAMPTZ,
  billing_details          JSONB,
  created_at               TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE test_credits (
  id                  SERIAL PRIMARY KEY,
  user_id             INTEGER NOT NULL REFERENCES users(id),
  credits_purchased   INTEGER NOT NULL,
  credits_used        INTEGER DEFAULT 0,
  price_paid_inr      DOUBLE PRECISION,
  purchased_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE insurance_api_requests (
  id              SERIAL PRIMARY KEY,
  api_key         VARCHAR(100) NOT NULL,
  company_name    VARCHAR(255),
  certificate_id  VARCHAR(36),
  endpoint        VARCHAR(100),
  response_status INTEGER,
  billed_inr      DOUBLE PRECISION DEFAULT 10.0,
  requested_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_insurance_api_key ON insurance_api_requests(api_key);

-- ── RLS — enable on every public table ──────────────────────────────────
-- The backend connects with the service_role key (RLS-bypass). Authenticated
-- clients hitting Supabase REST/Realtime directly will need policies — add
-- per-table policies in a follow-up migration once auth flow is wired.
ALTER TABLE users                       ENABLE ROW LEVEL SECURITY;
ALTER TABLE farms                       ENABLE ROW LEVEL SECURITY;
ALTER TABLE ponds                       ENABLE ROW LEVEL SECURITY;
ALTER TABLE hatcheries                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches                     ENABLE ROW LEVEL SECURITY;
ALTER TABLE counting_sessions           ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnosis_sessions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE pcr_feedback                ENABLE ROW LEVEL SECURITY;
ALTER TABLE grading_sessions            ENABLE ROW LEVEL SECURITY;
ALTER TABLE qc_certificates             ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_model_versions           ENABLE ROW LEVEL SECURITY;
ALTER TABLE outbreak_alerts             ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_quality_readings      ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_queue                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_sessions              ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_feedback              ENABLE ROW LEVEL SECURITY;
ALTER TABLE ml_training_jobs            ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_evaluations           ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_data_submissions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions               ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_credits                ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_api_requests      ENABLE ROW LEVEL SECURITY;

-- Allow QC certificate verification by certificate_id without auth (public
-- endpoint /verify/<certId> in the web app). Read-only; no PII exposed.
CREATE POLICY "Public can verify QC certs"
  ON qc_certificates FOR SELECT
  TO anon
  USING (is_valid = TRUE AND is_revoked = FALSE);

-- Allow the public marketing site to read the current AI model version list
-- (drives the "5 models" registry in the dashboard).
CREATE POLICY "Public can list current AI models"
  ON ai_model_versions FOR SELECT
  TO anon
  USING (is_current = TRUE);

-- ── Newsletter subscribers ───────────────────────────────────────────────
-- Footer subscribe form writes here directly via the Supabase JS client.
-- Defense in depth: GRANTs limit which verbs anon can attempt, RLS policy
-- adds row-level checks, DB CHECK constraint guards backend writes too.
CREATE TABLE newsletter_subscribers (
  id          SERIAL PRIMARY KEY,
  email       VARCHAR(255) NOT NULL UNIQUE,
  source      VARCHAR(50)  DEFAULT 'footer',
  ip_address  VARCHAR(45),
  user_agent  VARCHAR(500),
  created_at  TIMESTAMPTZ  DEFAULT NOW(),
  CONSTRAINT newsletter_email_format CHECK (
    email ~* '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$'
    AND length(email) BETWEEN 5 AND 254
  )
);
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- INSERT only — no SELECT/UPDATE/DELETE for public roles. The sequence is
-- still needed for the SERIAL id default.
GRANT INSERT ON newsletter_subscribers TO anon, authenticated;
GRANT USAGE ON SEQUENCE newsletter_subscribers_id_seq TO anon, authenticated;

CREATE POLICY newsletter_insert_only ON newsletter_subscribers
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(email) BETWEEN 5 AND 254
    AND email ~* '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$'
    AND length(COALESCE(source, '')) <= 50
    AND length(COALESCE(user_agent, '')) <= 500
  );
