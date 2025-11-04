import React, { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { NETWORK_CONFIG } from '../config/network';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(NETWORK_CONFIG.SOCKET_URL, { transports: ['websocket'] });
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
