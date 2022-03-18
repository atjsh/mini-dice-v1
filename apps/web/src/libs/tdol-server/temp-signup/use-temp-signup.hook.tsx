import { useMutation } from "react-query";
import { submitTempSignup } from "./submit-temp-signup";

export const useTempSignup = () => useMutation(submitTempSignup);
