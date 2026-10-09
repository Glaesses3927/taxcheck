# TaxCheck

バイト年収の壁チェック。複数のバイト先の課税対象額を月ごとに入力して合計し、年収の壁までの残りを確認する Web アプリです。

公開URL: https://main.d2v9cjkpz9s9ji.amplifyapp.com/

## できること

- 複数のバイト先を登録し、月ごとの課税対象額を入力する
- 入力方式は月ごとに「月額」か「累計」を選べる
  - **月額**: その月の課税対象額
  - **累計**: その月までの課税対象額の累計。直前の月までの累計との差を、その月の額として計算する
  - 未入力の月は 0 円として扱う。累計が前月より小さくなった（差がマイナスの）月は赤字で警告する
- バイト先ごと・全バイト合計の、月ごとの額と累計を表示する
- 全バイト合計の累計と、各「壁」までの残り額を表示する
  - 壁の名前と金額は画面上で編集・追加・削除できる。初期値は仮の金額なので、最新の制度を確認して設定すること
- 年ごとにデータを分けて管理する

税額の計算や控除の判定は行いません。入力された課税対象額を足し合わせるだけです。

## データの保存

データはブラウザの localStorage（キー `taxcheck:v1`）にだけ保存されます。サーバーには送信されず、別の端末やブラウザとは共有されません。ブラウザのサイトデータを消すとデータも消えます。

## アクセス解析

Google Analytics 4 を `@next/third-parties` の `GoogleAnalytics` で読み込んでいます（`app/layout.tsx`）。測定 ID はビルド時の環境変数 `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` から読み、未設定のときは読み込みません。ページビューなどの標準の計測だけで、入力した金額は送信しません。

Amplify では、アプリの環境変数に `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` を設定してから再ビルドします。

## 開発

Node.js 22 で動作を確認しています。

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 静的ファイルを out/ に書き出す
npm run lint
```

### 構成

| パス | 内容 |
|---|---|
| `lib/calc.ts` | 月額と累計の補完、合算などの計算（React に依存しない純粋関数） |
| `lib/useTaxData.ts` | localStorage を使ったデータの保存・読み込み（`useSyncExternalStore`） |
| `app/page.tsx` | 画面全体 |
| `components/` | バイト先の入力カード、月別集計表、壁パネル、金額入力 |

Next.js 16（App Router）、TypeScript、Tailwind CSS v4 を使っています。

## デプロイ

`next.config.ts` で `output: "export"` を指定しているので、`next build` の結果は静的ファイルとして `out/` に書き出されます。

AWS Amplify Hosting に GitHub の `main` ブランチをつないでいて、push すると自動でビルド・デプロイされます。ビルド設定は `amplify.yml`（`out/` を配信）です。

Amplify アプリのプラットフォームは静的ホスティング（`WEB`）にしておく必要があります。Next.js のリポジトリは SSR（`WEB_COMPUTE`）として自動判定されやすく、その場合 `Can't find required-server-files.json` というエラーでビルドが失敗します。アプリを作り直したときは、次のコマンドで切り替えてください。

```bash
aws amplify update-app --app-id <APP_ID> --platform WEB
aws amplify update-branch --app-id <APP_ID> --branch-name main --framework "Web"
```
