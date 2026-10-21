PRAGMA foreign_keys = ON;

CREATE TABLE jobs (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
  asset_key TEXT NOT NULL UNIQUE,
  asset_name TEXT NOT NULL,
  asset_type TEXT NOT NULL,
  asset_size INTEGER NOT NULL CHECK (asset_size >= 0),
  result_json TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE request_keys (
  key TEXT PRIMARY KEY,
  request_hash TEXT NOT NULL,
  job_id TEXT NOT NULL REFERENCES jobs(id),
  created_at TEXT NOT NULL
);

CREATE TABLE webhook_events (
  event_id TEXT PRIMARY KEY,
  job_id TEXT,
  event_type TEXT NOT NULL,
  received_at TEXT NOT NULL,
  FOREIGN KEY (job_id) REFERENCES jobs(id)
);

CREATE TABLE audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  action TEXT NOT NULL,
  subject_id TEXT,
  metadata_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX audit_logs_subject_id_idx ON audit_logs(subject_id);
CREATE INDEX jobs_status_idx ON jobs(status);
