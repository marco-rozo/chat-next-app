"use client";

import { useState } from "react";
import { RegisterModal } from "../../components/modals/RegisterModal";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { backendClient } from "../../core/config/backend.client";
import { setToken, setUser } from "../../core/utils/auth.util";
import { AuthResponseEntity } from "../../core/entities/auth.entity";
import { isFailure } from "@/src/core/entities/base.entity";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await backendClient.post<AuthResponseEntity>("/login", {
        email,
        password,
      });

      if (isFailure(response.data)) {
        toast.error(response.data.message);
        return;
      }


      if (response.data.token) {
        setToken(response.data.token);
        setUser(response.data.user);
      }
      toast.success("Login realizado com sucesso!");
      router.push("/chats");
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer login");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Acesse sua conta</h1>
          <p className="mt-2 text-sm text-secondary">
            Insira suas credenciasis para fazer o login
          </p>
        </div>

        <form className="mt-8 flex flex-col gap-4" onSubmit={handleLogin}>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 w-full rounded-lg border border-zinc-300 bg-transparent px-4 text-foreground focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground dark:border-zinc-700"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Senha
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Sua senha secreta"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 w-full rounded-lg border border-zinc-300 bg-transparent py-2 pl-4 pr-12 text-foreground focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground dark:border-zinc-700"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center justify-center px-4 text-secondary hover:text-foreground focus:outline-none"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                    <line x1="2" x2="22" y1="2" y2="22" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="mt-2 flex flex-col gap-3">
            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center rounded-lg bg-foreground px-4 font-semibold text-background transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 dark:focus:ring-offset-background"
            >
              Acessar
            </button>

            <button
              type="button"
              onClick={() => setShowRegisterModal(true)}
              className="flex h-12 w-full items-center justify-center rounded-lg border border-foreground bg-transparent px-4 font-semibold text-foreground transition-colors hover:bg-foreground hover:text-background focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 dark:focus:ring-offset-background"
            >
              Criar nova conta
            </button>
          </div>
        </form>
      </div>

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
      />
    </div>
  );
}
