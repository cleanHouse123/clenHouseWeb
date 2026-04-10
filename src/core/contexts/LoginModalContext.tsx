import {
    createContext,
    type ReactNode,
    useCallback,
    useContext,
    useMemo,
    useRef,
    useState,
} from 'react';

import { SmsLoginModal } from '@/core/components/modals/SmsLoginModal';

export type OpenLoginModalOptions = {
    /** Выполнится один раз при закрытии модалки (очистка URL и т.п.) */
    onClosed?: () => void;
};

type LoginModalContextValue = {
    isOpen: boolean;
    openLoginModal: (options?: OpenLoginModalOptions) => void;
    closeLoginModal: () => void;
};

const LoginModalContext = createContext<LoginModalContextValue | null>(null);

export function LoginModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const pendingOnClosedRef = useRef<(() => void) | null>(null);

    const openLoginModal = useCallback((options?: OpenLoginModalOptions) => {
        pendingOnClosedRef.current = options?.onClosed ?? null;
        setIsOpen(true);
    }, []);

    const closeLoginModal = useCallback(() => {
        setIsOpen(false);
        const cb = pendingOnClosedRef.current;
        pendingOnClosedRef.current = null;
        cb?.();
    }, []);

    const value = useMemo(
        () => ({
            isOpen,
            openLoginModal,
            closeLoginModal,
        }),
        [isOpen, openLoginModal, closeLoginModal],
    );

    return (
        <LoginModalContext.Provider value={value}>
            {children}
            <SmsLoginModal isOpen={isOpen} onClose={closeLoginModal} />
        </LoginModalContext.Provider>
    );
}

export function useLoginModal(): LoginModalContextValue {
    const ctx = useContext(LoginModalContext);
    if (!ctx) {
        throw new Error('useLoginModal нужно вызывать внутри LoginModalProvider');
    }
    return ctx;
}
