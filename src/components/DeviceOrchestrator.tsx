"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { io, Socket } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone } from "lucide-react";

export default function DeviceOrchestrator() {
  const [isOpen, setIsOpen] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [localIp, setLocalIp] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [tunnelOverride, setTunnelOverride] = useState("");

  useEffect(() => {
    // Generate secure 4 char architectural room ID 
    const newRoom = Math.random().toString(36).substring(2, 6).toUpperCase();
    setRoomId(newRoom);
    
    // Resolve whatever dynamic host the desktop is currently operating on (IP or Localtunnel)
    setLocalIp(window.location.origin);
  }, []);

  const initSocket = () => {
    if (socket) return;
    const newSocket = io({ transports: ["websocket", "polling"] });

    newSocket.on("connect", () => {
      newSocket.emit("join-room", roomId);
      console.log(`[Desktop Link] Joined Session ${roomId}`);
    });

    newSocket.on("gyro-update", (data) => {
      if (!isConnected) {
         setIsConnected(true);
         setIsOpen(false); // Auto-close modal when phone successfully handshakes
      }
      // Broadcast hardware vector calculations via global DOM pipeline
      window.dispatchEvent(new CustomEvent("gyro-update", { detail: data }));
    });

    setSocket(newSocket);
  };

  const handleOpen = () => {
    if (isConnected) return; // Do not open QR if already connected
    setIsOpen(true);
    initSocket();
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="fixed bottom-6 left-6 md:bottom-10 md:left-10 z-[150] w-12 h-12 bg-[#121212]/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover-target border border-white/20 transition-all hover:scale-110 hover:bg-white/10 mix-blend-difference group"
      >
        <Smartphone size={18} className={isConnected ? "text-emerald-400" : "text-white/60 group-hover:text-white"} />
        {isConnected && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && !isConnected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-[#0a0a0a]/80 backdrop-blur-sm flex items-center justify-center p-6 cursor-none"
            onClick={() => setIsOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#121212] border border-white/10 p-10 rounded-[2rem] flex flex-col items-center max-w-sm w-full shadow-[0_0_100px_rgba(255,255,255,0.05)] hover-target block cursor-none pointer-events-auto"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold tracking-tight mb-2 text-white">Cross-Device Control</h3>
              <p className="text-white/50 text-xs font-mono mb-8 text-center leading-relaxed">Scan with your smartphone camera to connect to the Matter.js physics engine.</p>
              
              <div className="bg-white p-4 rounded-xl mb-6 relative group">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-400/20 to-transparent h-1/2 -translate-y-10 animate-scan pointer-events-none" />
                
                <QRCodeSVG 
                  value={`${tunnelOverride || localIp}/remote?room=${roomId}`}
                  size={220}
                  level="H"
                  includeMargin={false}
                />
              </div>

              {localIp.includes("localhost") && (
                <div className="w-full mb-6">
                  <p className="text-[10px] text-white/40 mb-2 uppercase tracking-widest px-2">HTTPS Tunnel Override (For iOS):</p>
                  <input
                    type="text"
                    placeholder="Paste https://...loca.lt"
                    value={tunnelOverride}
                    onChange={(e) => setTunnelOverride(e.target.value.trim())}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg py-3 px-4 text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500 transition-colors pointer-events-auto cursor-text shadow-inner"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}

              <div className="w-full border-t border-white/10 pt-6 flex justify-between items-center text-xs font-mono">
                <span className="text-white/40 uppercase tracking-widest">Session</span>
                <span className="bg-white/5 px-3 py-1 border border-white/10 rounded-full text-white tracking-widest">{roomId}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
