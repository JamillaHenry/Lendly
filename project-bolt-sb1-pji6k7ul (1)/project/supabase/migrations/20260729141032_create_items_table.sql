/*
# Create items table for Lendly neighborhood lending app

1. New Tables
- `items`
  - `id` (uuid, primary key, auto-generated)
  - `title` (text, not null) — name of the item
  - `description` (text, not null) — details about the item
  - `category` (text, not null) — Tools, Outdoor, Sports, Home, Games, Other
  - `listing_type` (text, not null) — 'lend' (offering to lend out) or 'borrow' (requesting to borrow)
  - `image_url` (text, not null) — photo of the item itself
  - `house_photo_url` (text, not null) — photo of the lender's house so borrowers can find it
  - `lender_name` (text, not null) — name of the person listing the item
  - `address` (text, not null) — street address of the lender
  - `latitude` (numeric, not null) — map latitude
  - `longitude` (numeric, not null) — map longitude
  - `borrow_duration_days` (integer, nullable) — how many days the borrower needs the item; only set when listing_type is 'borrow'
  - `created_at` (timestamptz, default now())

2. Indexes
- Index on `category` for filtering by category
- Index on `listing_type` for filtering by lend/borrow

3. Security
- Enable RLS on `items`.
- This is a no-auth neighborhood app — all listings are intentionally public/shared.
- Allow anon + authenticated full CRUD so the anon-key frontend can read and write.
*/

CREATE TABLE IF NOT EXISTS items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  listing_type text NOT NULL CHECK (listing_type IN ('lend', 'borrow')),
  image_url text NOT NULL,
  house_photo_url text NOT NULL,
  lender_name text NOT NULL,
  address text NOT NULL,
  latitude numeric(9,6) NOT NULL,
  longitude numeric(9,6) NOT NULL,
  borrow_duration_days integer,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);
CREATE INDEX IF NOT EXISTS idx_items_listing_type ON items(listing_type);

ALTER TABLE items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_items" ON items;
CREATE POLICY "anon_select_items" ON items FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_items" ON items;
CREATE POLICY "anon_insert_items" ON items FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_items" ON items;
CREATE POLICY "anon_update_items" ON items FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_items" ON items;
CREATE POLICY "anon_delete_items" ON items FOR DELETE
  TO anon, authenticated USING (true);
