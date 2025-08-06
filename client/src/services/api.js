const API_BASE_URL ='https://weekly-allocations-production-2307.up.railway.app';
// export const submitAllocation = async (data) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/allocations/submit`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(data)
//     });

//     const result = await response.json();
    
//     if (!response.ok) {
//       throw new Error(result.error || `HTTP error! status: ${response.status}`);
//     }
    
//     return result;
//   } catch (error) {
//     console.error('API Error:', error);
//     throw error;
//   }
// };
export const submitAllocation = async (data) => {
    const response = await fetch(`${API_BASE_URL}/allocations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  };
  export const fetchProjects = async () => {
    const response = await fetch(`${API_BASE_URL}/projects`);
    return response.json();
  };
  
export const testConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/allocations/test`);
    return await response.json();
  } catch (error) {
    console.error('Connection test failed:', error);
    throw error;
  }
};
