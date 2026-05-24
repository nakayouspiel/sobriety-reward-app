# Sobriety Reward App

個人向け節酒・報酬系アプリケーション。

## 技術スタック
- **Frontend**: Next.js (App Router), TypeScript
- **Styling**: Vanilla CSS (CSS Modules)
- **Database**: Supabase
- **Charts**: Recharts
- **PWA**: next-pwa

## セットアップ

1. ライブラリのインストール:
   ```bash
   npm install
   ```

2. 環境変数の設定:
   `.env.local.example` を `.env.local` にリネームし、SupabaseのURLとキーを設定してください。

3. 開発サーバーの起動:
   ```bash
   npm run dev
   ```

## Supabase テーブル作成 SQL

```sql
-- Daily Logs table
create table daily_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  record_date date not null,
  stamp_type text check (stamp_type in ('VICTORY', 'DATE', 'HOME')) not null,
  created_at timestamp with time zone default now(),
  unique(user_id, record_date)
);

-- User Settings table
create table user_settings (
  user_id uuid references auth.users primary key,
  motivation_text text,
  updated_at timestamp with time zone default now()
);

-- RLS (Row Level Security)
alter table daily_logs enable row level security;
alter table user_settings enable row level security;

create policy "Users can manage their own logs"
  on daily_logs for all
  using (auth.uid() = user_id);

create policy "Users can manage their own settings"
  on user_settings for all
  using (auth.uid() = user_id);
```
