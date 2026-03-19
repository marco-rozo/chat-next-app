import { IUserChat } from "@/src/core/entities/chat.entity";
import { UserEntity } from "@/src/core/entities/user.entity";
import { UserStatusEnum } from "@/src/core/enums/userStatus.enum";
import { ChatTitle } from "./ChatTitle";
import { ChatSubtitle } from "./ChatSubtitle";
import { ChatSuffixInfo } from "./ChatSuffixInfo";

interface ChatCardProps {
    chat: IUserChat;
    currentUserId: string;
    onClick: () => void;
    newsMessagesCount?: number | null;
}

export function ChatCard({ chat, currentUserId, onClick, newsMessagesCount }: ChatCardProps) {
    const otherParticipant: UserEntity | undefined = chat.participants.find(
        (p) => p.id !== currentUserId
    );

    const contactStatus = chat.contactStatus ?? UserStatusEnum.OFFLINE;
    const hasUnreadMessages: boolean = (newsMessagesCount ?? 0) > 0;

    return (
        <button
            onClick={onClick}
            className="w-full rounded-lg border border-zinc-200 bg-white p-4 text-left transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
        >
            <div className="flex items-center justify-between">
                <div>
                    <ChatTitle
                        contactName={otherParticipant?.name || "Chat"}
                        contactStatus={contactStatus}
                    />
                    <ChatSubtitle lastMessage={chat.lastMessage} hasUnreadMessages={hasUnreadMessages} />
                </div>
                <div className="flex flex-col items-end gap-1">
                    <ChatSuffixInfo updatedAt={chat.updatedAt} />
                    {hasUnreadMessages && (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-zinc-900 shadow-sm">
                            {(newsMessagesCount ?? 0) > 99 ? '99+' : newsMessagesCount}
                        </div>
                    )}
                </div>
            </div>
        </button>
    );
}
