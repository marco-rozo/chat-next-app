import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { socketService } from '../utils/socket.service';

export const useSocket = (userId: string) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if (!userId) {
            setSocket(null);
            return;
        }
        const socketInstance = socketService.connect(userId);
        setSocket(socketInstance);
    }, [userId]);

    return socket;
};