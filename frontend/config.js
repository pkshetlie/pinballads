const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://perlimpinpin:8000/'; // Cela garantit une base par défaut même si la variable est absente

// Toujours uniformiser le slash en fin de base
const config = {
    BASE_URL: BASE_URL,
    CDN_BASE_URL: BASE_URL ,
    API_BASE_URL: `${BASE_URL}api/`,
};

export default config;

