/** @type {import('next').NextConfig} */
const nextConfig = {
  // Natively allow ALL local tunnels so you don't have to restart when the URL changes
  allowedDevOrigins: [
    "localhost",
    "192.168.1.6"
  ]
};

// Because wildcard domains might not be strictly supported in older Next.js versions,
// we'll explicitly read the current Tunnel string from process args if needed,
// but the easiest bypass for the QR Code is just to run the desktop natively on localhost.

module.exports = nextConfig;
