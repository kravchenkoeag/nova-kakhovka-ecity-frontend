// File: apps/admin/app/(auth)/login/page.tsx
// Оновити сторінку логіну для адмін панелі

"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Loader2, AlertCircle, ShieldAlert } from "lucide-react";

/**
 * Сторінка логіну для адмін панелі
 */
export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 🔄 КРИТИЧНО: callbackUrl для редіректу після логіну
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [blockedInfo, setBlockedInfo] = useState<{
    reason?: string;
    blockedAt?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBlockedInfo(null);
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false, // Не редіректимо автоматично
      });

      if (result?.error) {
        // Перевіряємо чи це помилка блокування
        if (
          result.error.includes("blocked") ||
          result.error.includes("заблоковано")
        ) {
          // Намагаємось отримати додаткову інформацію про блокування
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/login`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
              }
            );

            if (response.status === 403) {
              const data = await response.json();
              setBlockedInfo({
                reason: data.block_reason,
                blockedAt: data.blocked_at,
              });
              setError(
                data.message ||
                  "Ваш акаунт заблоковано. Зверніться до модератора."
              );
            } else {
              setError(result.error);
            }
          } catch {
            setError("Ваш акаунт заблоковано. Зверніться до модератора.");
          }
        } else {
          setError(result.error);
        }
      } else if (result?.ok) {
        // ✅ Успішний логін - редірект на callbackUrl
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Помилка авторизації");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              NK
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Адмін панель
          </CardTitle>
          <CardDescription className="text-center">
            Nova Kakhovka e-City
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              />
            </div>

            {/* Error Alert */}
            {error && (
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
import { Loader2, AlertCircle, ShieldAlert } from "lucide-react";

/**
 * Сторінка логіну для адмін панелі
 */
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [blockedInfo, setBlockedInfo] = useState<{
    reason?: string;
    blockedAt?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBlockedInfo(null);
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // Перевіряємо чи це помилка блокування
        if (
          result.error.includes("blocked") ||
          result.error.includes("заблоковано")
        ) {
          // Намагаємось отримати додаткову інформацію про блокування
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/login`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
              }
            );

            if (response.status === 403) {
              const data = await response.json();
              setBlockedInfo({
                reason: data.block_reason,
                blockedAt: data.blocked_at,
              });
              setError(
                data.message ||
                  "Ваш акаунт заблоковано. Зверніться до модератора."
              );
            } else {
              setError(result.error);
            }
          } catch {
            setError("Ваш акаунт заблоковано. Зверніться до модератора.");
          }
        } else {
          setError(result.error);
        }
      } else if (result?.ok) {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Помилка авторизації");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              NK
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Адмін панель
          </CardTitle>
          <CardDescription className="text-center">
            Nova Kakhovka e-City
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              />
            </div>

            {/* Error Alert */}
            {error && (
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
