import axios from 'axios';

export async function getServerHealth() {
  try {
    const response = await axios.get('/health', {
      baseURL: process.env.SERVER_URL,
      timeout: 500,
    });

    if (response.status == 200) {
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
}
