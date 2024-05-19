# 大宮祭2024 - 星空に浮かぶストーリー

GPT-4oおよびDALL-E 3を用いた作品です。
ユーザの入力したキーワードをもとに、詩と星座を生成します。

![大宮祭2024のイメージ](./img.png)

## 初回起動

```bash
cp .env.temp .env.local
```

`.env.local`を編集し、Open AIのAPIキーを入力してください。

その後は以下で起動できます。

```bash
$ npm install
$ npm run dev
```

## 2回目以降の起動

```bash
$ npm run dev
```

## ログの自動保存

[スクリーンショット自動撮影Chrome拡張機能](https://github.com/Shiba-Lab/seiza-gpt-screenshot-extension)をインストールすると、生成された画面を自動でスクショして保存できます。

#### 使い方

1. Google Chromeで chrome://extensions/ を開く
1. 右上のトグルでデベロッパー モードを有効にする
1. 「パッケージ化されていない拡張機能を読み込む」→「seiza-gpt-screenshot-extension」フォルダを選択
1. インストールされた「星座GPTスクショ保存」のIDをコピー (例: `aajnpgichbndclmpfoefmhoeehipikmo`のような文字列)
1. このプロジェクトの `.env.local` に `NEXT_PUBLIC_CHROME_EXTENSION_ID` として追加
1. 星座の生成が終わると、自動でスクリーンショットがダウンロードされます

# Original README

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
