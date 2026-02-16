-- News table
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  original_content TEXT NOT NULL,
  source TEXT NOT NULL,
  published_at TIMESTAMPTZ NOT NULL,
  categories TEXT[] NOT NULL DEFAULT '{}',
  related_tools TEXT[] NOT NULL DEFAULT '{}',
  url TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Exchange rates table
CREATE TABLE IF NOT EXISTS exchange_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  currency_code TEXT NOT NULL,
  rate NUMERIC NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  is_weekend BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_categories ON news USING GIN (categories);
CREATE INDEX IF NOT EXISTS idx_news_related_tools ON news USING GIN (related_tools);
CREATE INDEX IF NOT EXISTS idx_exchange_rates_currency_date ON exchange_rates (currency_code, date DESC);

-- RLS policies (allow public read, service_role write)
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on news" ON news FOR SELECT USING (true);
CREATE POLICY "Allow service_role insert on news" ON news FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on exchange_rates" ON exchange_rates FOR SELECT USING (true);
CREATE POLICY "Allow service_role insert on exchange_rates" ON exchange_rates FOR INSERT WITH CHECK (true);

-- Updated_at trigger for news
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER news_updated_at
  BEFORE UPDATE ON news
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
