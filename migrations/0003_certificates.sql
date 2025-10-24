-- Certificates system tables

-- Certificate templates (one per course)
CREATE TABLE IF NOT EXISTS certificate_templates (
  id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL,
  template_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User certificates
CREATE TABLE IF NOT EXISTS certificates (
  id SERIAL PRIMARY KEY,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  course_id INTEGER NOT NULL,
  course_title TEXT NOT NULL,
  issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completion_date TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_certificate_templates_course_id ON certificate_templates(course_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user_email ON certificates(user_email);
CREATE INDEX IF NOT EXISTS idx_certificates_course_id ON certificates(course_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_certificates_user_course ON certificates(user_email, course_id);
