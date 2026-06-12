import { useEffect, useState } from 'react';

// Variables globales para la caché en memoria
let cachedBanners: any[] | null = null;
let lastFetchTime: number | null = null;
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutos

const API_URL = 'https://2374i4xhvj.execute-api.us-east-2.amazonaws.com/dev-home/banners'; // Reemplaza con tu URL real

export const useBanners = () => {
  const [banners, setBanners] = useState<any[]>(cachedBanners || []);
  const [loading, setLoading] = useState(!cachedBanners);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBanners = async () => {
      const now = Date.now();
      
      // Si tenemos caché y aún no han pasado los 5 minutos, usamos los datos locales
      if (cachedBanners && lastFetchTime && (now - lastFetchTime < CACHE_DURATION_MS)) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(API_URL);
        
        if (!response.ok) throw new Error('Error en la red al obtener banners');
        
        const data = await response.json();
        
        // Guardamos en caché global
        cachedBanners = data;
        lastFetchTime = now;
        
        setBanners(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []); // Se ejecuta solo al montar el componente que use este hook

  return { banners, loading, error };
};