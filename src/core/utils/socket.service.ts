import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "../consts/chat.consts";

class SocketService {
    private socket: Socket | null = null;
    private currentUserId: string | null = null;

    connect(userId: string): Socket {
        if (this.socket?.connected && this.currentUserId === userId) {
            return this.socket;
        }

        if (this.socket) {
            this.socket.disconnect();
        }

        this.currentUserId = userId;

        this.socket = io(SOCKET_URL, {
            auth: { userId }
        });

        return this.socket;
    }

    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    getSocket(): Socket | null {
        return this.socket;
    }

    isConnected(): boolean {
        return this.socket?.connected ?? false;
    }
}

export const socketService = new SocketService();
