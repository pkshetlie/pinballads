const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://perlimpinpin:8000/'; // Cela garantit une base par défaut même si la variable est absente

// Toujours uniformiser le slash en fin de base
const config = {
    BASE_URL: BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`,
    IMAGE_BASE_URL: BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`,
    INVENTORY_IMAGE_BASE_URL: `${BASE_URL}imgs/inventory/`,
    API_BASE_URL: `${BASE_URL}api/`,
};

export default config;

