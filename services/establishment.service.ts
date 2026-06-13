import { Establishment } from '../models/commons.model';

const ESTABLISHMENTS_API_URL = 'https://6bj1x5lt4e.execute-api.us-east-2.amazonaws.com/dev-establishment/list';
export const fetchAllEstablishments = async (): Promise<Establishment[]> => {
  try {
    const response = await fetch(ESTABLISHMENTS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ limit: 10 }), 
    });

    if (!response.ok) throw new Error(`Error: ${response.status}`);

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error("Error obteniendo establecimientos:", error);
    return [];
  }
};