export const googleOAuthCredential = {
  clientId:
    '445176763040-5ovst5gjp3kco6g39kifnbpgvl5j7nrj.apps.googleusercontent.com',
  redirectUri: '/auth/google-oauth',
};

export const getGoogleOAuthPageUrl = () =>
  `https://accounts.google.com/o/oauth2/v2/auth?client_id=${
    googleOAuthCredential.clientId
  }&redirect_uri=${import.meta.env.SERVER_URL}${
    googleOAuthCredential.redirectUri
  }/${btoa(
    import.meta.env.WEB_URL!,
  ).toString()}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email&access_type=offline&include_granted_scopes=true&state=state_parameter_passthrough_value`;
