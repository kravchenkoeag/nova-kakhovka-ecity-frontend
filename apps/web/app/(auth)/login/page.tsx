// File: apps/web/app/(auth)/login/page.tsx

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
import { Loader2, AlertCircle, ShieldAlert, ArrowLeft } from "lucide-react";

/**
 * Сторінка логіну для веб-додатку
 *
 * 🔒 Публічна сторінка (без auth middleware)
 * ⚠️ Після логіну користувач перенаправляється на callbackUrl або /profile
 */
export default function WebLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/profile";

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
            setError(
              "Ваш акаунт заблоковано. Для отримання додаткової інформації дивіться деталі нижче.",
            );
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
      {/* Back Button */}
      <Link
        href="/"
        className="absolute top-4 left-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">На головну</span>
      </Link>

      <div className="w-full max-w-md space-y-6">
        <Card className="shadow-xl">
          <CardHeader className="space-y-2 text-center">
            {/* Logo/Brand */}
            <div className="flex justify-center mb-4">
              <div className="text-4xl font-bold text-blue-600">
                Нова Каховка
              </div>
            </div>

            <CardTitle className="text-2xl font-bold text-gray-900">
              Вхід до системи
            </CardTitle>
            <CardDescription className="text-base text-gray-600">
              Введіть ваші дані для входу
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
                  placeholder="your.email@example.com"
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

              {/* Blocked User Info - Детальна інформація */}
              {blockedInfo && (
                <Alert variant="destructive" className="border-red-300">
                  <ShieldAlert className="h-5 w-5 text-red-600" />
                  <AlertDescription>
                    <div className="space-y-3">
                      <div className="border-b border-red-200 pb-3">
                        <p className="font-bold text-red-900 text-base mb-2">
                          ⚠️ Ваш акаунт заблоковано
                        </p>
                        {blockedInfo.reason && (
                          <p className="text-sm text-red-800">
                            <span className="font-semibold">Причина:</span>{" "}
                            {blockedInfo.reason}
                          </p>
                        )}
                        {blockedInfo.blockedAt && (
                          <p className="text-sm text-red-800 mt-1">
                            <span className="font-semibold">
                              Дата блокування:
                            </span>{" "}
                            {new Date(blockedInfo.blockedAt).toLocaleString(
                              "uk-UA",
                              {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </p>
                        )}
                      </div>
                      <div className="bg-red-50 rounded-md p-3">
                        <p className="text-sm text-red-900 font-medium mb-1">
                          📞 Що робити далі?
                        </p>
                        <p className="text-sm text-red-700 mt-1">
                          Для розблокування акаунту та отримання додаткової
                          інформації зверніться до модератора або адміністратора
                          платформи через контактну форму або електронну пошту:{" "}
                          <a
                            href="mailto:support@nk-ecity.com"
                            className="underline font-medium"
                          >
                            support@nk-ecity.com
                          </a>
                        </p>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={loading || !!blockedInfo}
              >
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

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Ще не маєте акаунту?{" "}
                <Link
                  href="/register"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Зареєструватися
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <p className="text-sm text-center text-blue-900">
              <strong>Потрібна допомога?</strong>
              <br />
              Зверніться до служби підтримки за адресою{" "}
              <a
                href="mailto:support@nk-ecity.com"
                className="underline font-medium"
              >
                support@nk-ecity.com
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
