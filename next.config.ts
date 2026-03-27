import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Temporario: paginas de atendimento/impressao desativadas ate segunda ordem
      { source: '/painel-atendimento', destination: '/', permanent: false },
      { source: '/atendimento', destination: '/', permanent: false },
      { source: '/painel-impressao', destination: '/', permanent: false },
      { source: '/impressao', destination: '/', permanent: false },
    ];
  },
};

export default nextConfig;
