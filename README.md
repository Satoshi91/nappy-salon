# Nappy Salon

会員制サロンのコンテンツ管理システムです。ランクに応じたコンテンツのアクセス制御と会員管理機能を提供します。

## 機能

### コンテンツ管理
- コンテンツの作成・編集・削除
- ランク別アクセス制御（Guest / Bronze / Silver / Gold）
- カードビュー / リストビューの切り替え
- サムネイル画像の表示

### 会員管理
- 会員の登録・編集・削除
- ランク管理（Bronze / Silver / Gold）
- 権限管理（管理者、コンテンツ管理）

### 認証・認可
- ユーザー切り替え機能
- ランクに基づくコンテンツアクセス制御
- 権限に基づく管理機能の制御

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS 4
- **UIライブラリ**: React 19
- **アイコン**: Lucide React

## セットアップ

### 前提条件

- Node.js 18以上
- npm / yarn / pnpm / bun

### インストール

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

http://localhost:3000 でアプリケーションにアクセスできます。

### 環境変数

`.env.local` ファイルを作成し、必要な環境変数を設定してください。

```env
# APIエンドポイント
NEXT_PUBLIC_API_URL=your_api_url
```

## ディレクトリ構成

```
nappy-salon/
├── app/                    # Next.js App Router
│   ├── about/             # アバウトページ
│   ├── contact/           # お問い合わせページ
│   ├── contents/          # コンテンツ関連ページ
│   │   ├── [id]/         # コンテンツ詳細・編集
│   │   └── new/          # 新規コンテンツ作成
│   ├── members/           # 会員関連ページ
│   │   ├── [id]/         # 会員詳細
│   │   └── new/          # 新規会員登録
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx           # トップページ
│   └── globals.css        # グローバルスタイル
├── components/            # 共通コンポーネント
│   ├── AccessDeniedModal.tsx
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── LoginModal.tsx
│   ├── Navigation.tsx
│   ├── PermissionBadge.tsx
│   ├── RankBadge.tsx
│   └── UserSelector.tsx
├── lib/                   # ユーティリティ・型定義
│   ├── api.ts            # APIクライアント
│   ├── auth-context.tsx  # 認証コンテキスト
│   ├── rank-utils.ts     # ランク関連ユーティリティ
│   └── types.ts          # TypeScript型定義
└── scripts/              # スクリプト
    ├── seed-contents.mjs # コンテンツシードデータ
    └── seed-members.mjs  # 会員シードデータ
```

## スクリプト

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# 本番サーバー起動
npm start

# リント実行
npm run lint
```

## ライセンス

Private
