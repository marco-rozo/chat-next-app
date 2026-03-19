"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { backendClient } from "../../core/config/backend.client";
import { AuthResponseEntity } from "../../core/entities/auth.entity";
import { isFailure } from "@/src/core/entities/base.entity";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RegisterModal({ isOpen, onClose }: RegisterModalProps) {
  const [name, setName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordLengthError, setPasswordLengthError] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");

  if (!isOpen) return null;

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let hasError = false;

    if (name.trim().length >= 3) {
      setNameError("");
    } else {
      setNameError("Nome deve ter pelo menos 3 caracteres.");
      hasError = true;
    }

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (emailRegex.test(registerEmail)) {
      setEmailError("");
    } else {
      setEmailError("Digite um email válido.");
      hasError = true;
    }

    if (registerPassword.length >= 6) {
      setPasswordLengthError("");
    } else {
      setPasswordLengthError("A senha deve ter no mínimo 6 caracteres.");
      hasError = true;
    }

    if (registerPassword === registerConfirmPassword) {
      setPasswordMatchError("");
    } else {
      setPasswordMatchError("As senhas não conferem.");
      hasError = true;
    }

    if (hasError) {
      toast.error("Verifique os campos do formulário");
      return;
    }

    try {
      const response = await backendClient.post<AuthResponseEntity>("/register", {
        name,
        email: registerEmail,
        password: registerPassword,
      });
      if (isFailure(response.data)) {
        toast.error(response.data.message);
        return;
      }

      toast.success("Usuário registrado com sucesso!");
      setName("");
      setRegisterEmail("");
      setRegisterPassword("");
      setRegisterConfirmPassword("");
      setNameError("");
      setEmailError("");
      setPasswordLengthError("");
      setPasswordMatchError("");
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Tivemos um problema ao registrar sua conta.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="mb-6 text-2xl font-bold text-foreground">
          Criar nova conta
        </h2>
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm font-medium text-foreground">
              Nome completo
            </label>
            <input
              id="name"
              type="text"
              placeholder="Seu nome completo"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError("");
              }}
              className={`h-12 w-full rounded-lg border bg-transparent px-4 text-foreground focus:outline-none focus:ring-1 ${nameError
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-zinc-300 focus:border-foreground focus:ring-foreground dark:border-zinc-700"
                }`}
              required
            />
            {nameError && (
              <span className="text-sm font-medium text-red-500">
                {nameError}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="registerEmail" className="text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="registerEmail"
              type="email"
              placeholder="seu@email.com"
              value={registerEmail}
              onChange={(e) => {
                setRegisterEmail(e.target.value);
                setEmailError("");
              }}
              className={`h-12 w-full rounded-lg border bg-transparent px-4 text-foreground focus:outline-none focus:ring-1 ${emailError
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-zinc-300 focus:border-foreground focus:ring-foreground dark:border-zinc-700"
                }`}
              required
            />
            {emailError && (
              <span className="text-sm font-medium text-red-500">
                {emailError}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="registerPassword" className="text-sm font-medium text-foreground">
              Senha
            </label>
            <input
              id="registerPassword"
              type="password"
              placeholder="Sua senha secreta"
              value={registerPassword}
              onChange={(e) => {
                setRegisterPassword(e.target.value);
                setPasswordLengthError("");
                setPasswordMatchError("");
              }}
              className={`h-12 w-full rounded-lg border bg-transparent px-4 text-foreground focus:outline-none focus:ring-1 ${passwordLengthError || passwordMatchError
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-zinc-300 focus:border-foreground focus:ring-foreground dark:border-zinc-700"
                }`}
              required
            />
            {passwordLengthError && (
              <span className="text-sm font-medium text-red-500">
                {passwordLengthError}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="registerConfirmPassword" className="text-sm font-medium text-foreground">
              Confirmar sua senha
            </label>
            <input
              id="registerConfirmPassword"
              type="password"
              placeholder="Confirme sua senha"
              value={registerConfirmPassword}
              onChange={(e) => {
                setRegisterConfirmPassword(e.target.value);
                setPasswordMatchError("");
              }}
              className={`h-12 w-full rounded-lg border bg-transparent px-4 text-foreground focus:outline-none focus:ring-1 ${passwordMatchError
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-zinc-300 focus:border-foreground focus:ring-foreground dark:border-zinc-700"
                }`}
              required
            />
            {passwordMatchError && (
              <span className="text-sm font-medium text-red-500">
                {passwordMatchError}
              </span>
            )}
          </div>

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex h-12 flex-1 items-center justify-center rounded-lg border border-zinc-300 bg-transparent px-4 font-semibold text-foreground transition-colors hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:border-zinc-700 dark:hover:bg-zinc-800 dark:focus:ring-offset-background"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex h-12 flex-1 items-center justify-center rounded-lg bg-foreground px-4 font-semibold text-background transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 dark:focus:ring-offset-background"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
