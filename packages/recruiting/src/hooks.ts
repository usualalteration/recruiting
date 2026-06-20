import { NuvolarisClient } from '$lib/api';
import { API_BASE_URL } from '$lib/constants';

const client = new NuvolarisClient(API_BASE_URL);

export async function load({ cookies }) {
  const token = cookies.get('token');
  
  if (!token) {
    return { token: null, user: null };
  }
  
  try {
    const response = await client.getUser(token);
    return { token, user: response.user };
  } catch {
    cookies.delete('token');
    return { token: null, user: null };
  }
}
