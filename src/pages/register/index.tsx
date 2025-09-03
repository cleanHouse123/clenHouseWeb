import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/core/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/core/components/ui/form";
import { Input } from "@/core/components/ui/inputs/input";

import { useRegisterByEmail } from "@/modules/auth/hooks/useRegisterByEmail";
import { useAuthStore } from "@/modules/auth/store/authStore";
import { User } from "@/core/types/user";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/core/constants/routes";
import { ThemeToggle } from "@/core/feauture/theme/theme-toggle";

const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "validation.required")
      .min(2, "validation.name.min")
      .max(50, "validation.name.max"),
    email: z.string().min(1, "validation.required").email("validation.email"),
    password: z
      .string()
      .min(1, "validation.required")
      .min(6, "validation.password.min")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "validation.password.complex"),
    confirmPassword: z.string().min(1, "validation.required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "validation.password.match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: registerByEmail } = useRegisterByEmail();
  const { setUser, setAccessToken, setRefreshToken } = useAuthStore()
  const navigate = useNavigate()

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const response = await registerByEmail(data);
      console.log(response, "response");
      setUser(response.user as unknown as User);
      setAccessToken(response.accessToken);
      setRefreshToken(response.refreshToken);
      navigate(ROUTES.ADMIN.ORDERS.LIST);
    } catch (error) {
      console.error("Ошибка регистрации:", error);
      form.setError("root", {
        type: "manual",
        message: "Ошибка регистрации. Попробуйте еще раз.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-background to-secondary p-4">
      <div className="w-full flex justify-end">
        <LanguageSwitcher />

        <ThemeToggle />
      </div>
      <div className="w-full max-w-md flex-1 flex items-center justify-center">
        <Card className="shadow-xl border-0 bg-card w-full">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-card-foreground">
              {t("auth.register.title")}
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              {t("auth.register.description")}
            </p>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-card-foreground">
                        {t("common.name")}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                          <Input
                            {...field}
                            type="text"
                            placeholder={t("auth.register.name.placeholder")}
                            className="pl-12 bg-input border-input focus:border-ring focus:ring-ring"
                            autoComplete="given-name"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-card-foreground">
                        {t("common.email")}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                          <Input
                            {...field}
                            type="email"
                            placeholder={t("auth.register.email.placeholder")}
                            className="pl-12 bg-input border-input focus:border-ring focus:ring-ring"
                            autoComplete="email"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-card-foreground">
                        {t("common.password")}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder={t(
                              "auth.register.password.placeholder"
                            )}
                            className="pl-12 pr-12 bg-input border-input focus:border-ring focus:ring-ring"
                            autoComplete="new-password"
                          />
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-card-foreground">
                        {t("common.confirmPassword")}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                          <Input
                            {...field}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder={t(
                              "auth.register.confirmPassword.placeholder"
                            )}
                            className="pl-12 pr-12 bg-input border-input focus:border-ring focus:ring-ring"
                            autoComplete="new-password"
                          />
                          <button
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.formState.errors.root && (
                  <div className="text-destructive text-sm text-center bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                    {form.formState.errors.root.message}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-2"></div>
                      {t("common.loading")}
                    </div>
                  ) : (
                    t("auth.register.button")
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {t("auth.register.hasAccount")}{" "}
                <a
                  href="/login"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  {t("auth.register.loginLink")}
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
