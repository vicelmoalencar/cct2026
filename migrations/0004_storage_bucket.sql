-- Create storage bucket for certificate templates
-- This should be run in Supabase SQL Editor

-- Insert bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('certificate-templates', 'certificate-templates', true)
ON CONFLICT (id) DO NOTHING;

-- Set bucket policies to allow public read and authenticated insert/update
CREATE POLICY "Public can read certificate templates"
ON storage.objects FOR SELECT
USING (bucket_id = 'certificate-templates');

CREATE POLICY "Authenticated users can upload certificate templates"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'certificate-templates' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update certificate templates"
ON storage.objects FOR UPDATE
USING (bucket_id = 'certificate-templates' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete certificate templates"
ON storage.objects FOR DELETE
USING (bucket_id = 'certificate-templates' AND auth.role() = 'authenticated');
