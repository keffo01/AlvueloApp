import { Establishment } from '@/models/commons.model';

// URL de tu API Gateway en AWS (Reemplázala con la tuya)
const API_URL = 'https://js9mwdkefi.execute-api.us-east-2.amazonaws.com/dev-quickOptions/catalog';

export const fetchEstablishmentsByCategory = async (
  category: string,
  lastEvaluatedKey: any = null
): Promise<{ items: Establishment[]; lastEvaluatedKey: any }> => {
  try {
    const body = {
      category,
      limit: 5,
      lastEvaluatedKey
    };

 const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
});

    // En tu servicio, cambia la parte del error por esto:
if (!response.ok) {
  const errorData = await response.text(); // Leemos el cuerpo del error
  console.log("Error detallado del servidor:", errorData); // <-- ESTO ES LO QUE NECESITAMOS
  throw new Error(`Error ${response.status}: ${errorData}`);
}
    const data = await response.json();
    
    return {
      items: data.items, // Aquí vendrán los datos mapeados
      lastEvaluatedKey: data.lastEvaluatedKey // Llave para la siguiente página
    };
  } catch (error) {
    console.error("Error fetching from AWS:", error);
    throw error;
  }
};