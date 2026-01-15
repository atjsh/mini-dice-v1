import { CountryCode3Type } from '@packages/shared-types';
import axios from 'axios';

class SubmitTempSignupDto {
  turnstileToken: string;
  username: string;
  countryCode3: CountryCode3Type;
}

export async function submitTempSignup({
  turnstileToken,
  username,
  countryCode3,
}: SubmitTempSignupDto): Promise<boolean> {
  await axios.post(
    '/temp-signup',
    {
      turnstileToken,
      username,
      countryCode3,
    },
    {
      baseURL: import.meta.env.VITE_SERVER_URL,
      withCredentials: true,
    },
  );

  return true;
}
