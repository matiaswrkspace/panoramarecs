import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Solo in sviluppo: permette di aprire il sito dal telefono tramite l'IP del Mac.
  allowedDevOrigins: ["192.168.1.11"],
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2678400, // 31 giorni
  },
};

export default nextConfig;
