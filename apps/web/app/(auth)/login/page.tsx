// File: apps/web/app/(auth)/login/page.tsx
// Оновити сторінку логіну веб-додатку

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
 */
export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 🔄 КРИТИЧНО: callbackUrl для редіректу після логіну
  const callbackUrl = searchParams.get("callbackUrl") || "/";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-4">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            На головну
          </Button>
        </Link>

        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                NK
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Вхід до e-City
            </CardTitle>
            <CardDescription className="text-center">
              Введіть свої дані для входу в систему
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
                  placeholder="your-email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Пароль</Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Забули пароль?
                  </Link>
                </div>
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
                <Alert
                  variant="destructive"
                  className="border-red-200 bg-red-50"
                >
                  <ShieldAlert className="h-5 w-5 text-red-600" />
                  <AlertDescription>
                    <div className="space-y-3">
                      <div>
                        <p className="font-semibold text-red-900 text-base">
                          Ваш акаунт заблоковано
                        </p>
                        <p className="text-sm text-red-700 mt-1">
                          Вхід в систему тимчасово обмежено
                        </p>
                      </div>

                      {blockedInfo.reason && (
                        <div className="bg-white/50 rounded p-3 border border-red-200">
                          <p className="text-sm font-medium text-red-900">
                            Причина блокування:
                          </p>
                          <p className="text-sm text-red-800 mt-1">
                            {blockedInfo.reason}
                          </p>
                        </div>
                      )}

                      {blockedInfo.blockedAt && (
                        <p className="text-xs text-red-700">
                          Дата блокування:{" "}
                          {new Date(blockedInfo.blockedAt).toLocaleString(
                            "uk-UA",
                            {
                              dateStyle: "long",
                              timeStyle: "short",
                            }
                          )}
                        </p>
                      )}

                      <div className="border-t border-red-200 pt-3">
                        <p className="text-sm text-red-800 font-medium">
                          Що робити далі?
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
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Помилка авторизації");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-4">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            На головну
          </Button>
        </Link>

        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                NK
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Вхід до e-City
            </CardTitle>
            <CardDescription className="text-center">
              Введіть свої дані для входу в систему
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
                  placeholder="your-email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Пароль</Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Забули пароль?
                  </Link>
                </div>
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
                <Alert
                  variant="destructive"
                  className="border-red-200 bg-red-50"
                >
                  <ShieldAlert className="h-5 w-5 text-red-600" />
                  <AlertDescription>
                    <div className="space-y-3">
                      <div>
                        <p className="font-semibold text-red-900 text-base">
                          Ваш акаунт заблоковано
                        </p>
                        <p className="text-sm text-red-700 mt-1">
                          Вхід в систему тимчасово обмежено
                        </p>
                      </div>

                      {blockedInfo.reason && (
                        <div className="bg-white/50 rounded p-3 border border-red-200">
                          <p className="text-sm font-medium text-red-900">
                            Причина блокування:
                          </p>
                          <p className="text-sm text-red-800 mt-1">
                            {blockedInfo.reason}
                          </p>
                        </div>
                      )}

                      {blockedInfo.blockedAt && (
                        <p className="text-xs text-red-700">
                          Дата блокування:{" "}
                          {new Date(blockedInfo.blockedAt).toLocaleString(
                            "uk-UA",
                            {
                              dateStyle: "long",
                              timeStyle: "short",
                            }
                          )}
                        </p>
                      )}

                      <div className="border-t border-red-200 pt-3">
                        <p className="text-sm text-red-800 font-medium">
                          Що робити далі?
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
