// apps/web/next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Увімкнути React Strict Mode для виявлення потенційних проблем
  reactStrictMode: true,

  // Пакети які потрібно транспілювати (monorepo packages)
  transpilePackages: [
    "@ecity/ui",
    "@ecity/auth",
    "@ecity/api-client",
    "@ecity/types",
    "@ecity/websocket",
  ],

  // Конфігурація для Next.js Image Optimization
  images: {
    domains: ["localhost", "your-cdn-domain.com"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/uploads/**",
      },
    ],
  },

  // Змінні оточення доступні в браузері (NEXT_PUBLIC_*)
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL,
  },

  // Експериментальні функції Next.js 14
  experimental: {
    // Оптимізація імпорту пакетів для зменшення bundle size
    optimizePackageImports: ["@ecity/ui", "lucide-react"],

    // ВАЖЛИВО: Виключити next-auth з server components bundling
    // Це вирішує проблему з openid-client в Edge Runtime
    serverComponentsExternalPackages: ["next-auth", "openid-client"],
  },

  // Налаштування для production build
  output: "standalone", // для оптимізації Docker образів

  // Webpack конфігурація (за потреби)
  webpack: (config, { isServer }) => {
    // Виключити певні модулі з client bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
