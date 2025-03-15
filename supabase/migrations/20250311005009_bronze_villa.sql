/*
  # Create user-related tables for financial control

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `user_expenses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `description` (text)
      - `amount` (numeric)
      - `category` (text)
      - `date` (date)
      - `created_at` (timestamp)
    - `user_investments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `description` (text)
      - `amount` (numeric)
      - `yield_amount` (numeric)
      - `date` (date)
      - `created_at` (timestamp)
    - `user_debts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `description` (text)
      - `total_amount` (numeric)
      - `paid_amount` (numeric)
      - `due_date` (date)
      - `created_at` (timestamp)
    - `user_payments`
      - `id` (uuid, primary key)
      - `debt_id` (uuid, references user_debts)
      - `amount` (numeric)
      - `date` (date)
      - `created_at` (timestamp)
    - `user_transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `type` (text)
      - `amount` (numeric)
      - `description` (text)
      - `date` (date)
      - `created_at` (timestamp)
    - `user_salary`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `amount` (numeric)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_expenses table
CREATE TABLE IF NOT EXISTS user_expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles NOT NULL,
  description text NOT NULL,
  amount numeric NOT NULL CHECK (amount >= 0),
  category text NOT NULL,
  date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user_investments table
CREATE TABLE IF NOT EXISTS user_investments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles NOT NULL,
  description text NOT NULL,
  amount numeric NOT NULL CHECK (amount >= 0),
  yield_amount numeric NOT NULL DEFAULT 0,
  date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user_debts table
CREATE TABLE IF NOT EXISTS user_debts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles NOT NULL,
  description text NOT NULL,
  total_amount numeric NOT NULL CHECK (total_amount >= 0),
  paid_amount numeric NOT NULL DEFAULT 0 CHECK (paid_amount >= 0),
  due_date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user_payments table
CREATE TABLE IF NOT EXISTS user_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  debt_id uuid REFERENCES user_debts NOT NULL,
  amount numeric NOT NULL CHECK (amount >= 0),
  date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user_transactions table
CREATE TABLE IF NOT EXISTS user_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles NOT NULL,
  type text NOT NULL CHECK (type IN ('deposito', 'saque')),
  amount numeric NOT NULL CHECK (amount >= 0),
  description text NOT NULL,
  date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user_salary table
CREATE TABLE IF NOT EXISTS user_salary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles NOT NULL,
  amount numeric NOT NULL CHECK (amount >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_debts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_salary ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can view own expenses"
  ON user_expenses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expenses"
  ON user_expenses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expenses"
  ON user_expenses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own expenses"
  ON user_expenses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own investments"
  ON user_investments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own investments"
  ON user_investments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own investments"
  ON user_investments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own investments"
  ON user_investments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own debts"
  ON user_debts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own debts"
  ON user_debts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own debts"
  ON user_debts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own debts"
  ON user_debts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view payments for own debts"
  ON user_payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_debts
      WHERE id = user_payments.debt_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert payments for own debts"
  ON user_payments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_debts
      WHERE id = debt_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own transactions"
  ON user_transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON user_transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own salary"
  ON user_salary FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own salary"
  ON user_salary FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own salary"
  ON user_salary FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create trigger to update user_profiles updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_salary_updated_at
  BEFORE UPDATE ON user_salary
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();