-- ============================================
-- RPC FUNCTIONS FOR COMPLEX QUERIES (FIXED)
-- ============================================

-- Drop old functions first
DROP FUNCTION IF EXISTS get_lesson_with_module(BIGINT);
DROP FUNCTION IF EXISTS get_user_course_progress(TEXT, BIGINT);

-- Function to get lesson with module information
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
    m.title as module_title,
    m.course_id
  FROM lessons l
  JOIN modules m ON l.module_id = m.id
  WHERE l.id = p_lesson_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get user progress for a course (FIXED - removed up.created_at)
CREATE OR REPLACE FUNCTION get_user_course_progress(p_user_email TEXT, p_course_id BIGINT)
RETURNS TABLE (
  id BIGINT,
  user_email TEXT,
  lesson_id BIGINT,
  completed BOOLEAN,
  completed_at TIMESTAMPTZ,
  module_id BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.id,
    up.user_email,
    up.lesson_id,
    up.completed,
    up.completed_at,
    l.module_id
  FROM user_progress up
  JOIN lessons l ON up.lesson_id = l.id
  JOIN modules m ON l.module_id = m.id
  WHERE up.user_email = p_user_email AND m.course_id = p_course_id;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_lesson_with_module(BIGINT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_user_course_progress(TEXT, BIGINT) TO anon, authenticated;
