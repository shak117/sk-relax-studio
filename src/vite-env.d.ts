/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string;
  readonly VITE_META_PIXEL_ID?: string;
  readonly VITE_GSC_VERIFICATION_TOKEN?: string;
  readonly VITE_REQUIRE_CONSENT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
