"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, Zoom } from "react-toastify";
import { backendClient } from "@/src/core/config/backend.client";
import { getToken, getUser, removeToken, removeUser } from "@/src/core/utils/auth.util";
import { FindUserResponse } from "@/src/core/entities/user.entity";
import { IUserChat, UserChatsResponse, CreateChatResponse, INewMessageNotification } from "@/src/core/entities/chat.entity";
import { isFailure } from "@/src/core/entities/base.entity";
import { ChatEventsEnum } from "@/src/core/enums/chatEvents.enum";
import { UserStatusEnum } from "@/src/core/enums/userStatus.enum";
import { useSocket } from "@/src/core/hooks/useSocket";
import { ChatsPageHeader } from "@/src/components/chats/ChatsPageHeader";
import { ChatList } from "@/src/components/chats/ChatList";
import { NewChatModal } from "@/src/components/chats/NewChatModal";


interface CheckUserOnlineResponse {
    data: {
        userId: string;
        isOnline: boolean;
    };
}

export default function ChatsPage() {
    const socket = useSocket(getUser()?.id!);
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentUser, setCurrentUser] = useState<{ id: string; name: string } | null>(null);
    const [userChats, setUserChats] = useState<IUserChat[]>([]);
    const [isLoadingChats, setIsLoadingChats] = useState(false);

    useEffect(() => {
        if (!socket || !socket.connected) {
            console.log('[Socket] Socket não conectado, aguardando...');
            return;
        }

        if (userChats.length === 0) {
            console.log('[Socket] Nenhum chat carregado ainda');
            return;
        }

        console.log(`[Socket] Entrando em ${userChats.length} salas...`);
        userChats.forEach((chat) => {
            socket.emit(ChatEventsEnum.JOIN_ROOM, { room: chat._id, user: currentUser?.name || "Usuário" });
            console.log(`[Socket] Emitido JOIN_ROOM para sala: ${chat._id}`);
        });
    }, [socket, socket?.connected, userChats, currentUser?.name]);

    useEffect(() => {
        if (!socket) {
            console.log('[Socket] Socket não disponível');
            return;
        }

        socket.on(ChatEventsEnum.USER_STATUS_CHANGED, (data: { userId: string, status: UserStatusEnum }) => {
            setOnlineUsers((prev) => {
                const newSet = new Set(prev);
                if (data.status === UserStatusEnum.ONLINE) {
                    newSet.add(data.userId);
                } else {
                    newSet.delete(data.userId);
                }
                return newSet;
            });

            setUserChats((prevChats) =>
                prevChats.map((chat) => {
                    const otherParticipant = chat.participants.find((p) => p.id === data.userId);
                    if (otherParticipant) {
                        return { ...chat, contactStatus: data.status };
                    }
                    return chat;
                })
            );
        });

        socket.on(ChatEventsEnum.NEW_MESSAGE_NOTIFICATION, (notification: INewMessageNotification) => {
            setUserChats((prevChats) =>
                prevChats.map((chat) => {
                    if (chat._id === notification.chatId) {
                        return {
                            ...chat,
                            lastMessage: notification.content,
                            updatedAt: new Date().toISOString(),
                            newsMessagesCount: (chat.newsMessagesCount || 0) + 1
                        };
                    }
                    return chat;
                })
            );

            const messageText: string = `${notification.content.substring(0, 30)}${notification.content.length > 30 ? '...' : ''}`

            toast(
                <div>
                    <strong className="block font-bold text-sm">{notification.senderName}</strong>
                    <span className="mt-1 text-sm text-zinc-500">{messageText}</span>
                </div>,
                {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Zoom,
                }
            );
        });

        return () => {
            socket.offAny();
            socket.off(ChatEventsEnum.USER_STATUS_CHANGED);
            socket.off(ChatEventsEnum.NEW_MESSAGE_NOTIFICATION);
        };
    }, [socket]);

    const fetchUserChats = async (userId: string) => {
        try {
            setIsLoadingChats(true);
            const response = await backendClient.get<UserChatsResponse>(`/user-chats/${userId}`);
            console.log("Response from user-chats:", response);
            if (isFailure(response)) {
                toast.error(response.message);
                return;
            }
            if (Array.isArray(response.data)) {
                setUserChats(response.data);
                // As salas serao ingressadas pelo useEffect abaixo quando o socket conectar
                await checkContactsOnlineStatus(response.data, userId);
            }
        } catch (err: any) {
            console.error("Erro ao carregar chats:", err);
            toast.error(err.message || "Erro ao carregar chats");
        } finally {
            setIsLoadingChats(false);
        }
    };


    const checkContactsOnlineStatus = async (chats: IUserChat[], currentUserId: string) => {
        const contactIds = chats
            .flatMap((chat) => chat.participants)
            .filter((participant) => participant.id !== currentUserId)
            .map((participant) => participant.id);

        const uniqueContactIds = [...new Set(contactIds)];

        for (const contactId of uniqueContactIds) {
            try {
                const response = await backendClient.get<CheckUserOnlineResponse>(`/check-user-online/${contactId}`);
                if (response.data) {
                    const { userId, isOnline } = response.data;
                    const status = isOnline ? UserStatusEnum.ONLINE : UserStatusEnum.OFFLINE;

                    setOnlineUsers((prev) => {
                        const newSet = new Set(prev);
                        if (isOnline) {
                            newSet.add(userId);
                        } else {
                            newSet.delete(userId);
                        }
                        return newSet;
                    });

                    setUserChats((prevChats) =>
                        prevChats.map((chat) => {
                            const otherParticipant = chat.participants.find((p) => p.id === userId);
                            if (otherParticipant) {
                                return { ...chat, contactStatus: status };
                            }
                            return chat;
                        })
                    );
                }
            } catch (error) {
                console.error(`Erro ao verificar status do usuário ${contactId}:`, error);
            }
        }
    };

    useEffect(() => {
        const token = getToken();
        if (!token) {
            handleLogout();
            return;
        }

        const user = getUser();
        if (user && user.id) {
            setCurrentUser(user as { id: string; name: string });
            fetchUserChats(user.id);
        }
    }, [router]);

    const handleLogout = () => {
        if (socket) {
            socket.disconnect();
        }
        removeToken();
        removeUser();
        router.push("/login");
    };

    const handleCreateChat = async (e: React.FormEvent, emailValue: string) => {
        e.preventDefault();

        if (!emailValue.trim()) {
            toast.error("Por favor, insira um email");
            return;
        }

        const currentUser = getUser();
        if (!currentUser?.id) {
            toast.error("Falha ao recuperar usuario logado. Faça login novamente.");
            return;
        }

        setIsSubmitting(true);

        try {
            const findUserResponse = await backendClient.get<FindUserResponse>(`/find-user/${emailValue}`);

            console.log("Response from find-user:", findUserResponse);

            const foundUser = findUserResponse.data;
            if (!foundUser || "message" in foundUser || !foundUser.id) {
                toast.error("Usuário não encontrado");
                setShowModal(false);
                return;
            }

            const chatData = {
                participants: [currentUser.id, foundUser.id],
            };

            const createChatResponse = await backendClient.post<CreateChatResponse>("/create-chat", chatData);
            console.log("Response from create-chat:", createChatResponse);

            if (isFailure(createChatResponse.data)) {
                toast.error(createChatResponse.data.message);
                return;
            }

            const roomId = createChatResponse.data._id;

            setShowModal(false);
            toast.success("Chat criado com sucesso!");

            router.push(`/chat?roomId=${roomId}&receiverId=${foundUser.id}&userName=${encodeURIComponent(foundUser.name)}`);
        } catch (err: any) {
            toast.error(err.message || "Erro ao criar chat");
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleChatClick = (chat: IUserChat) => {
        // reseta contador de msgs para 0 quando o usuario abrir o chat
        setUserChats((prevChats) =>
            prevChats.map((c) => {
                if (c._id === chat._id) {
                    return { ...c, newsMessagesCount: 0 };
                }
                return c;
            })
        );

        const otherParticipant = chat.participants.find((p) => p.id !== currentUser?.id);
        router.push(`/chat?roomId=${chat._id}&receiverId=${otherParticipant?.id}&userName=${encodeURIComponent(otherParticipant?.name || "Chat")}`);
    };

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="mx-auto max-w-4xl">
                <ChatsPageHeader
                    userName={currentUser?.name}
                    onNewChatClick={() => setShowModal(true)}
                    onLogout={handleLogout}
                />

                <ChatList
                    chats={userChats}
                    currentUserId={currentUser?.id || ""}
                    isLoading={isLoadingChats}
                    onChatClick={handleChatClick}
                />
            </div>

            <NewChatModal
                isOpen={showModal}
                onClose={closeModal}
                onSubmit={handleCreateChat}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}


