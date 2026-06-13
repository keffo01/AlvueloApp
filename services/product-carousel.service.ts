const CAROUSEL_API_URL = 'https://cxyirmqxo5.execute-api.us-east-2.amazonaws.com/dev-productCarousel/product-carousel';

export const fetchCarouselProducts = async () => {
  try {
    const response = await fetch(CAROUSEL_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ limit: 10 }), // Ajusta el límite según necesites
    });

    if (!response.ok) {
      throw new Error(`Error en el servidor: ${response.status}`);
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error("Error obteniendo productos estrella:", error);
    return [];
  }
};