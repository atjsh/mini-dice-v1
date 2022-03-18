import axios from "axios";

class SubmitTempSignupDto {
  hCaptchaSuccessToken: string;
  username: string;
}

export async function submitTempSignup({
  hCaptchaSuccessToken,
  username
}: SubmitTempSignupDto): Promise<boolean> {
  const result = await axios.post(
    "/temp-signup",
    {
      hCaptchaSuccessToken,
      username
    },
    {
      baseURL: process.env.REACT_APP_TDOL_SERVER_URL,
      withCredentials: true
    }
  );

  return true;
}
