-- Create table for storing deep research results
CREATE TABLE IF NOT EXISTS research_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  response_id TEXT UNIQUE NOT NULL,
  company_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('queued', 'in_progress', 'completed', 'failed', 'cancelled')),
  query TEXT,
  output_text TEXT,
  annotations JSONB,
  vector_store_ids TEXT[],
  metadata JSONB,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  failed_at TIMESTAMP WITH TIME ZONE,
  event_data JSONB,
  error_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_research_results_response_id ON research_results(response_id);
CREATE INDEX idx_research_results_company_name ON research_results(company_name);
CREATE INDEX idx_research_results_status ON research_results(status);
CREATE INDEX idx_research_results_created_at ON research_results(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_research_results_updated_at 
  BEFORE UPDATE ON research_results 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies (if using Supabase Auth)
ALTER TABLE research_results ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own research results
CREATE POLICY "Users can read own research results" ON research_results
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Policy: Service role can manage all research results
CREATE POLICY "Service role can manage research results" ON research_results
  FOR ALL
  USING (auth.role() = 'service_role');

-- Create view for recent research
CREATE OR REPLACE VIEW recent_research AS
SELECT 
  response_id,
  company_name,
  status,
  query,
  CASE 
    WHEN LENGTH(output_text) > 200 
    THEN SUBSTRING(output_text, 1, 200) || '...'
    ELSE output_text
  END AS summary,
  jsonb_array_length(COALESCE(annotations, '[]'::jsonb)) AS source_count,
  started_at,
  completed_at,
  EXTRACT(EPOCH FROM (COALESCE(completed_at, NOW()) - started_at)) AS duration_seconds
FROM research_results
WHERE created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;

-- Grant permissions
GRANT SELECT ON recent_research TO authenticated;
GRANT ALL ON research_results TO service_role;
