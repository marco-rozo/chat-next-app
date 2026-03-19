import { useState, useEffect } from "react";

interface NewChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent, email: string) => Promise<void>;
    isSubmitting: boolean;
}

export function NewChatModal({ isOpen, onClose, onSubmit, isSubmitting }: NewChatModalProps) {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen) {
            setEmail("");
            setError("");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email.trim()) {
            setError("O email é obrigatório");
            return;
        }

        if (!validateEmail(email)) {
            setError("Por favor, insira um email válido");
            return;
        }

        await onSubmit(e, email);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-foreground">Novo Chat</h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-500 hover:text-foreground"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium text-foreground"
                        >
                            Email do usuário
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError("");
                            }}
                            placeholder="Digite o email do usuário"
                            className={`w-full rounded-lg border bg-background px-4 py-2 text-foreground focus:border-foreground focus:outline-none dark:border-zinc-800 ${error ? "border-red-500" : "border-zinc-200"}`}
                        />
                        {error && (
                            <p className="mt-1 text-sm text-red-500">{error}</p>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting || !email.trim()}
                        className="w-full rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:opacity-80 disabled:opacity-50"
                    >
                        {isSubmitting ? "Criando..." : "Criar Chat"}
                    </button>
                </form>
            </div>
        </div>
    );
}
