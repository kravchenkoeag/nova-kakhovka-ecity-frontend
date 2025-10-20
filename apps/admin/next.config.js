// apps/admin/next.config.js
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
    optimizePackageImports: ["@ecity/ui", "lucide-react", "recharts"],

    // КРИТИЧНО ВАЖЛИВО: Виключити next-auth та залежності з Edge Runtime
    // Це вирішує проблему з openid-client в middleware
    serverComponentsExternalPackages: [
      "next-auth",
      "@next-auth/core",
      "next-auth/providers",
      "openid-client",
      "oauth4webapi",
      "preact",
      "preact-render-to-string",
      "@panva/hkdf",
      "jose",
      "uuid",
      "cookie",
    ],
  },

  // Налаштування для production build
  output: "standalone", // для оптимізації Docker образів

  // Webpack конфігурація
  webpack: (config, { isServer }) => {
    // Виключити певні модулі з client bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        path: false,
        os: false,
      };
    }

    return config;
  },
};

module.exports = nextConfig;
