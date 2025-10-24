-- ============================================
-- UPDATE RPC FUNCTION TO INCLUDE NEW FIELDS
-- ============================================
-- Execute este SQL DEPOIS de executar add-lesson-fields.sql

-- Drop old function first
DROP FUNCTION IF EXISTS get_lesson_with_module(BIGINT);

-- Function to get lesson with module information (WITH NEW FIELDS)
CREATE OR REPLACE FUNCTION get_lesson_with_module(p_lesson_id BIGINT)
RETURNS TABLE (
  id BIGINT,
  module_id BIGINT,
  title TEXT,
  description TEXT,
  video_url TEXT,
  video_provider TEXT,
  video_id TEXT,
  duration_minutes INTEGER,
  order_index INTEGER,
  created_at TIMESTAMPTZ,
  support_text TEXT,
  transcript TEXT,
  attachments JSONB,
  module_title TEXT,
  course_id BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.id,
    l.module_id,
    l.title,
    l.description,
    l.video_url,
    l.video_provider,
    l.video_id,
    l.duration_minutes,
    l.order_index,
    l.created_at,
    l.support_text,
    l.transcript,
    l.attachments,
    m.title as module_title,
    m.course_id
  FROM lessons l
  JOIN modules m ON l.module_id = m.id
  WHERE l.id = p_lesson_id;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_lesson_with_module(BIGINT) TO anon, authenticated;
