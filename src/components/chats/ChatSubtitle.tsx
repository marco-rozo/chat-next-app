interface ChatSubtitleProps {
    lastMessage: string | null;
    hasUnreadMessages: boolean;
}

export function ChatSubtitle({ lastMessage, hasUnreadMessages }: ChatSubtitleProps) {
    if (lastMessage) {
        return (
            <p className={`mt-1 text-sm ${hasUnreadMessages ? "font-bold" : "text-zinc-500"}`}>
                {lastMessage.substring(0, 50)}
                {lastMessage.length > 50 ? "..." : ""}
            </p>
        );
    }

    return <p className="mt-1 text-sm text-zinc-400">Nenhuma mensagem ainda</p>;
}
