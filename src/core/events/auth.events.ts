type AuthEventType = 'INVALID_TOKEN';
type AuthEventCallback = (message?: string) => void;

class AuthEventEmitter {
    private listeners: Map<AuthEventType, Set<AuthEventCallback>> = new Map();

    on(event: AuthEventType, callback: AuthEventCallback): () => void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)!.add(callback);

        return () => this.listeners.get(event)?.delete(callback);
    }

    emit(event: AuthEventType, message?: string): void {
        this.listeners.get(event)?.forEach(callback => callback(message));
    }
}

export const authEvents = new AuthEventEmitter();
