'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { INVALID_TOKEN_ERROR_CODE, LOGOUT_IN_PROGRESS_KEY } from '@/src/core/consts/auth.consts';
import { authEvents } from '@/src/core/events/auth.events';
import { logout } from '@/src/core/utils/auth.util';

interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const unsubscribe = authEvents.on(INVALID_TOKEN_ERROR_CODE, (message?: string) => {
            if (sessionStorage.getItem(LOGOUT_IN_PROGRESS_KEY)) {
                return;
            }
            sessionStorage.setItem(LOGOUT_IN_PROGRESS_KEY, 'true');

            toast.error(
                <div>
                    <strong className="block font-bold text-sm">{message}</strong>
                    <span className="mt-1 text-sm text-zinc-500">Redirecionando para o login</span>
                </div>,
                {
                    autoClose: 3000,
                    hideProgressBar: true,
                    onClose: () => logout()
                });
        });

        setIsInitialized(true);

        return () => {
            unsubscribe();
        };
    }, []);

    if (!isInitialized) {
        return null;
    }

    return <>{children}</>;
}
