import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

let sharedSocket = null;
const getSocket = () => {
    if (!sharedSocket) {
        sharedSocket = io({
            withCredentials: true,
            transports: ["websocket", "polling"],
            autoConnect: true,
        });
    }
    return sharedSocket;
};

/**
 * Subscribes to queue updates for a specific doctor and invokes onUpdate
 * with the server payload whenever the queue changes.
 */
export const useQueueSocket = (doctorId, onUpdate) => {
    const handlerRef = useRef(onUpdate);
    handlerRef.current = onUpdate;

    useEffect(() => {
        if (!doctorId) return undefined;
        const socket = getSocket();
        const listener = (payload) => handlerRef.current?.(payload);

        socket.emit("queue:join", doctorId);
        socket.on("queue:update", listener);

        return () => {
            socket.emit("queue:leave", doctorId);
            socket.off("queue:update", listener);
        };
    }, [doctorId]);
};

/*Creating and maintaining a single shared Socket.IO connection.
Allowing components to subscribe to live updates for a doctor's queue.
Listening for queue changes sent by the backend.
Automatically cleaning up listeners when they are no longer needed.
Providing real-time updates without repeatedly calling REST APIs.*/
