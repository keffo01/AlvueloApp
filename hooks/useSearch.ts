import { useEffect, useState } from 'react';

const API_URL = 'https://8wv88dklpe.execute-api.us-east-2.amazonaws.com/dev-search/search'; // 👈 Reemplaza esto

export const useSearch = (searchText: string) => {
  const [results, setResults] = useState({ establishments: [], products: [] });
  const [popularTags, setPopularTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Efecto 1: Cargar tags dinámicos al abrir la pantalla
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setPopularTags(data.popularTags || []))
      .catch(console.error);
  }, []);

  // Efecto 2: Buscar con "Debounce" (espera 500ms antes de buscar)
  useEffect(() => {
    if (searchText.length < 3) {
      setResults({ establishments: [], products: [] });
      setLoading(false);
      return;
    }

    setLoading(true);
    
    const timeoutId = setTimeout(() => {
      fetch(`${API_URL}?q=${encodeURIComponent(searchText)}`)
        .then(res => res.json())
        .then(data => {
          setResults({ 
            establishments: data.establishments || [], 
            products: data.products || [] 
          });
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }, 500); // 500 milisegundos de espera

    // Si el usuario sigue tecleando, cancelamos el timer anterior
    return () => clearTimeout(timeoutId);
  }, [searchText]);

  return { ...results, popularTags, loading };
};