// Custom Next.js Server Architecture
// Merges Socket.IO and Next.js onto a single port (3000) for seamless LocalTunnel / HTTPS routing.
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";

// Node.js cannot compile next.config.ts natively outside of the 'next dev' CLI. 
// We rely on standard Next.js behavior. It will print a warning about HMR, 
// but it will successfully serve the chunks symmetrically.
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log(`[Socket Connected] :: Client ID: ${socket.id}`);

    socket.on("join-room", (roomID) => {
      socket.join(roomID);
      console.log(`[Room Bind] :: Socket ${socket.id} joined session ${roomID}`);
    });

    socket.on("device-orientation", ({ roomID, tiltX, tiltY }) => {
      // Broadcast real-time vectors straight to desktop over the single port tunnel
      socket.to(roomID).emit("gyro-update", { tiltX, tiltY });
    });

    socket.on("disconnect", () => {
      console.log(`[Socket Terminated] :: Client ID: ${socket.id}`);
    });
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log("");
    console.log("🟢 Unified Web/Socket Pipeline initialized on http://localhost:3000");
    console.log("");
  });
});
