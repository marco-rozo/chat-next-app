import { IUserChat } from "@/src/core/entities/chat.entity";
import { ChatCard } from "./ChatCard";
import { EmptyChatList } from "./EmptyChatList";

interface ChatListProps {
    chats: IUserChat[];
    currentUserId: string;
    isLoading: boolean;
    onChatClick: (chat: IUserChat) => void;
}

export function ChatList({ chats, currentUserId, isLoading, onChatClick }: ChatListProps) {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-foreground"></div>
            </div>
        );
    }

    if (chats.length === 0) {
        return <EmptyChatList />;
    }

    return (
        <div className="space-y-4">
            {chats.map((chat, index) => (
                <ChatCard
                    key={chat._id || `chat-${index}`}
                    chat={chat}
                    currentUserId={currentUserId}
                    onClick={() => onChatClick(chat)}
                    newsMessagesCount={chat.newsMessagesCount}
                />
            ))}
        </div>
    );
}
