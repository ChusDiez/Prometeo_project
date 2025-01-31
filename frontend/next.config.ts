import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};
module.exports = {
  images: {
    domains: ['iz.academy'], // Dominio permitido
    formats: ['image/webp'], // Opcional: optimizar formato
    deviceSizes: [640, 750, 828, 1080, 1200] // Tamaños responsive
  },
};
export default nextConfig;
