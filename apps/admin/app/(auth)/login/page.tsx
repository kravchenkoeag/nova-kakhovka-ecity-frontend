// File: apps/admin/app/(auth)/login/page.tsx

"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Alert,
  AlertDescription,
} from "@ecity/ui";
import {
  Loader2,
  AlertCircle,
  ShieldAlert,
  Shield,
  ArrowLeft,
} from "lucide-react";

/**
 * Сторінка логіну для адмін панелі
 *
 * 🔒 Публічна сторінка (без auth middleware)
 * ⚠️ Після логіну користувач перенаправляється на callbackUrl або /dashboard
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [blockedInfo, setBlockedInfo] = useState<{
    reason?: string;
    blockedAt?: string;
  } | null>(null);

  // Обробка логіну через NextAuth
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setBlockedInfo(null);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // Спробуємо розпарсити помилку як JSON (для blocked user info)
        try {
          const errorData = JSON.parse(result.error);
          if (errorData.code === "USER_BLOCKED" && errorData.details) {
            setBlockedInfo({
              reason: errorData.details.reason,
              blockedAt: errorData.details.blockedAt,
            });
            setError("Ваш акаунт заблоковано. Дивіться деталі нижче.");
          } else {
            setError(errorData.message || "Невірний email або пароль");
          }
        } catch {
          // Якщо не JSON, просто виводимо помилку
          setError(result.error);
        }
      } else if (result?.ok) {
        // Успішний логін - перенаправлення на callbackUrl
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError("Помилка з'єднання з сервером");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Back Button */}
      <Link
        href="/"
        className="absolute top-4 left-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">На головну</span>
      </Link>

      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-2 text-center">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>

          <CardTitle className="text-2xl font-bold text-gray-900">
            Адмін Панель
          </CardTitle>
          <CardDescription className="text-base text-gray-600">
            Вхід до системи управління
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                autoComplete="current-password"
              />
            </div>

            {/* Error Alert */}
            {error && !blockedInfo && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Blocked User Info */}
            {blockedInfo && (
              <Alert variant="destructive">
                <ShieldAlert className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-semibold">Ваш акаунт заблоковано</p>
                    {blockedInfo.reason && (
                      <p className="text-sm">
                        <span className="font-medium">Причина:</span>{" "}
                        {blockedInfo.reason}
                      </p>
                    )}
                    {blockedInfo.blockedAt && (
                      <p className="text-sm">
                        <span className="font-medium">Дата блокування:</span>{" "}
                        {new Date(blockedInfo.blockedAt).toLocaleString(
                          "uk-UA"
                        )}
                      </p>
                    )}
                    <p className="text-sm mt-3 border-t pt-2">
                      Для розблокування акаунту зверніться до модератора або
                      адміністратора платформи.
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Вхід...
                </>
              ) : (
                "Увійти"
              )}
            </Button>
          </form>

          {/* Info Text */}
          <p className="mt-4 text-center text-sm text-gray-600">
            Доступ тільки для модераторів та адміністраторів
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
