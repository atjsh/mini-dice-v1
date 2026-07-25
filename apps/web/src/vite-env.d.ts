/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVER_URL: string;
  readonly VITE_TURNSTILE_SITE_KEY: string;
  readonly VITE_WEB_URL: string;
  readonly VITE_WEB_VERSION_KIND: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
