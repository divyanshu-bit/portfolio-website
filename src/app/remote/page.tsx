"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function MobileRemotePage() {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [status, setStatus] = useState("Initializing DOM...");
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [debugData, setDebugData] = useState({ x: 0, y: 0 });

  // Strictly Client-Side Execution Hook
  useEffect(() => {
    // Completely bypass Next.js routers and hooks to avoid Hydration panics
    if (typeof window === "undefined") return;

    setStatus("Reading URL Payload...");
    try {
      const qs = new URLSearchParams(window.location.search);
      const room = qs.get("room");
      
      if (!room) {
        setStatus("No Room Parameter in URL");
        // We do NOT return here, we want to allow them to test hardware anyway!
      } else {
        setRoomId(room);
        setStatus(`Attempting Tunnel to Session ${room}`);
      }
      
      // Establish native origin socket tunnel matching the current web port
      const newSocket = io({ transports: ["websocket", "polling"], timeout: 5000 });
      
      newSocket.on("connect", () => {
        if (room) {
           newSocket.emit("join-room", room);
           setStatus("VECTORS TUNNELED 🟢");
        } else {
           setStatus("SOCKET CONNECTED (No Room Binding)");
        }
        setSocket(newSocket);
      });
      
      newSocket.on("connect_error", (err) => {
        setStatus(`SOCKET BLOCKED: ${err.message}`);
      });

      return () => {
        newSocket.disconnect();
      };
    } catch (err) {
      setStatus("CRITICAL APP ERROR IN UI THREAD");
    }
  }, []);

  const requestAccess = () => {
    try {
      if (typeof window !== "undefined" && typeof DeviceOrientationEvent !== "undefined") {
          // @ts-ignore
          if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            // @ts-ignore
            DeviceOrientationEvent.requestPermission()
              .then((permissionState: string) => {
                if (permissionState === 'granted') {
                  startStreaming();
                } else {
                  setStatus("APPLE SECURITY DENIED: SENSOR ACCESS");
                }
              })
              .catch((err: any) => {
                 setStatus("HTTPS REQUIRED FOR APPLE HARDWARE");
              });
            return;
          }
      }
      startStreaming();
    } catch (err) {
      setStatus("SENSOR API MISSING IN BROWSER");
    }
  };

  const startStreaming = () => {
    setPermissionGranted(true);
    setStatus("STREAMING DATA TO HOST 📡");

    window.addEventListener("deviceorientation", (event) => {
      setDebugData({
        x: Math.round(event.gamma || 0),
        y: Math.round(event.beta || 0)
      });

      setSocket((currentSocket) => {
          setRoomId((currentRoom) => {
             if (currentSocket && currentRoom) {
               currentSocket.emit("device-orientation", {
                 roomID: currentRoom,
                 tiltX: event.gamma || 0, 
                 tiltY: event.beta || 0
               });
             }
             return currentRoom;
          });
          return currentSocket;
      });
    }, true);
  };

  return (
    <main className="min-h-[100dvh] bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden relative w-full hide-desktop-ui">
      
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none">
         <span className="text-[30vw] font-black uppercase tracking-tighter mix-blend-screen text-white">SYNC</span>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-sm">
        <div className="w-32 h-32 rounded-full border border-white/20 bg-white/5 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.05)] relative">
           {permissionGranted && (
             <div className="absolute inset-0 rounded-full border border-emerald-500 animate-[ping_2s_ease-out_infinite]" />
           )}
           <svg className={`w-12 h-12 ${permissionGranted ? 'text-emerald-400' : 'text-white/50'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-3 text-white">{roomId ? `SESSION ${roomId}` : "MANUAL OVERRIDE"}</h1>
          <p className={`font-mono text-[10px] uppercase tracking-[0.2em] w-full break-words max-w-xs ${status.includes("ERROR") || status.includes("DENIED") || status.includes("BLOCKED") || status.includes("MISSING") ? 'text-red-400' : 'text-emerald-400'}`}>{status}</p>
        </div>

        {/* ALWAYS show the button if permission is not yet granted, even if Room ID fails or Socket throws an error */}
        {!permissionGranted && (
          <button 
            onClick={requestAccess}
            className="mt-6 px-10 py-5 bg-white text-black font-bold tracking-widest uppercase text-sm rounded-full active:scale-95 transition-transform shadow-xl"
          >
            Activate Hardware
          </button>
        )}

        {permissionGranted && (
          <div className="mt-8 flex flex-col gap-4 w-full">
            <div className="p-6 rounded-2xl border border-white/10 bg-[#121212] text-left shadow-2xl">
              <div className="flex gap-4 items-center mb-4 border-b border-white/10 pb-4">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-emerald-400 text-xs font-mono uppercase tracking-widest leading-loose">Sensor Active</p>
              </div>
              <div className="flex justify-between font-mono text-xl text-white">
                 <span>X: {debugData.x}°</span>
                 <span>Y: {debugData.y}°</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
