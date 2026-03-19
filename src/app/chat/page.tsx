"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getToken, getUser } from "@/src/core/utils/auth.util";
import { useSocket } from "@/src/core/hooks/useSocket";
import { backendClient } from "@/src/core/config/backend.client";
import { ChatEventsEnum } from "@/src/core/enums/chatEvents.enum";
import { UserStatusEnum } from "@/src/core/enums/userStatus.enum";
import { ChatHeader } from "@/src/components/chat/ChatHeader";
import { ChatMessageArea } from "@/src/components/chat/ChatMessageArea";
import { ChatInputArea } from "@/src/components/chat/ChatInputArea";
import { IMessage } from "@/src/core/entities/chat.entity";

export default function ChatPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const roomId = searchParams.get("roomId");
    const otherUserName = searchParams.get("userName");
    const receiverId = searchParams.get("receiverId");

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<{ user: string; text: string }[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [currentUser, setCurrentUser] = useState<{ id: string; name: string } | null>(null);
    const [otherUserStatus, setOtherUserStatus] = useState<UserStatusEnum>(UserStatusEnum.OFFLINE);
    const socket = useSocket(currentUser?.id || "");

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const shouldScrollToBottom = () => {
        const container = messagesContainerRef.current;
        if (!container) return true;
        const threshold = 150;
        return container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
    };

    useEffect(() => {
        if (shouldScrollToBottom()) {
            scrollToBottom();
        }
    }, [messages]);

    useEffect(() => {
        if (!roomId) return;

        const loadMessageHistory = async () => {
            try {
                const response = await backendClient.get<{ data: IMessage[] }>(`/get-messages/${roomId}`);
                if (response.data && Array.isArray(response.data)) {
                    const user = getUser();
                    const historyMessages = response.data.map((msg: IMessage) => ({
                        user: msg.sender === user?.id ? user?.name : (otherUserName || "Usuário"),
                        text: msg.content
                    }));
                    setMessages(historyMessages);

                    setTimeout(() => {
                        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
                    }, 100);
                }
            } catch (error) {
                console.error("Erro ao carregar histórico de mensagens:", error);
            }
        };

        loadMessageHistory();
    }, [roomId, otherUserName]);

    useEffect(() => {
        if (!receiverId) return;

        const checkUserStatus = async () => {
            try {
                const response = await backendClient.get<{ data: { userId: string; isOnline: boolean } }>(`/check-user-online/${receiverId}`);
                if (response.data) {
                    setOtherUserStatus(response.data.isOnline ? UserStatusEnum.ONLINE : UserStatusEnum.OFFLINE);
                }
            } catch (error) {
                console.error("Erro ao verificar status do usuário:", error);
            }
        };

        checkUserStatus();
    }, [receiverId]);

    useEffect(() => {
        const token = getToken();
        const user = getUser();

        if (!token) {
            router.push("/login");
            return;
        }

        if (user && user.id) {
            setCurrentUser(user as { id: string; name: string; email: string });
        }

        if (!roomId) {
            router.push("/chats");
            return;
        }
    }, [router, roomId]);

    useEffect(() => {
        if (!socket || !roomId || !currentUser) return;

        const user = getUser();

        socket.emit(ChatEventsEnum.JOIN_ROOM, { room: roomId, user: user?.name || "Usuário" });

        const messageHandler = (data: IMessage) => {
            if (data.chat !== roomId) {
                return;
            }
            if (data.sender === user?.id) {
                return;
            }
            const senderName = data.senderName || "Usuário";
            setMessages((prev) => [...prev, { user: senderName, text: data.content }]);
        };

        const userStatusChangedHandler = (data: { userId: string; status: UserStatusEnum }) => {
            if (data.userId === receiverId) {
                setOtherUserStatus(data.status);
            }
        };

        socket.on(ChatEventsEnum.RECEIVE_MESSAGE, messageHandler);
        socket.on(ChatEventsEnum.USER_STATUS_CHANGED, userStatusChangedHandler);

        return () => {
            socket.off(ChatEventsEnum.RECEIVE_MESSAGE, messageHandler);
            socket.off(ChatEventsEnum.USER_STATUS_CHANGED, userStatusChangedHandler);
        };
    }, [socket, roomId, currentUser]);

    const handleSendMessage = () => {
        if (!newMessage.trim() || !socket || !roomId || !currentUser || !receiverId) return;

        const messageData: IMessage = {
            chat: roomId,
            sender: currentUser.id,
            senderName: currentUser.name,
            receiver: receiverId,
            content: newMessage,
        };

        socket.emit(ChatEventsEnum.SEND_MESSAGE, messageData);

        setMessages((prev) => [...prev, { user: currentUser.name, text: newMessage }]);
        setNewMessage("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex h-screen flex-col bg-background">
            <ChatHeader
                otherUser={otherUserName || "Chat"}
                otherUserStatus={otherUserStatus}
                onDisconnect={() => router.push("/chats")}
            />
            <div className="flex-1 overflow-auto">
                <ChatMessageArea
                    messages={messages}
                    currentUser={currentUser?.name || ""}
                    messagesEndRef={messagesEndRef}
                    containerRef={messagesContainerRef}
                />
            </div>
            <ChatInputArea
                newMessage={newMessage}
                onMessageChange={setNewMessage}
                onKeyDown={handleKeyDown}
                onSendMessage={handleSendMessage}
            />
        </div>
    );
}
