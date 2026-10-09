import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // サーバー処理は不要なので静的書き出し（out/）して Amplify Hosting で配信する
  output: "export",
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
