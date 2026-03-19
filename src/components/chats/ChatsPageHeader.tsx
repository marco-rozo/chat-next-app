interface ChatsPageHeaderProps {
    userName?: string;
    onNewChatClick: () => void;
    onLogout: () => void;
}

export function ChatsPageHeader({ userName, onNewChatClick, onLogout }: ChatsPageHeaderProps) {
    return (
        <div className="mb-8 flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-foreground">
                    Bem vindo (a), {userName || "Usuário"}
                </h1>
                <p className="mt-1 text-sm text-zinc-500">Seus Chats</p>
            </div>
            <div className="flex gap-4">
                <button
                    onClick={onNewChatClick}
                    className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:opacity-80"
                >
                    Novo Chat
                </button>
                <button
                    onClick={onLogout}
                    className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                >
                    Sair
                </button>
            </div>
        </div>
    );
}
