declare namespace NodeJS {
  interface ProcessEnv {
    readonly ANALYZE?: string;
    readonly STRICT_RULES?: string;
    readonly FORCE_COLOR?: string;
    readonly NODE_ENV?: string;
    readonly DEBUG?: string;
    readonly SDEBUG?: string;
    readonly ENV_VARIABLE?: string;
    readonly NGROK_AUTH_TOKEN?: string;
    readonly TEST_WITH_SNAPSHOTS?: string;

    readonly LOCAL_ENV_VARIABLE: string;
    readonly DEVELOPMENT_ENV_VARIABLE: string;
    readonly PRODUCTION_ENV_VARIABLE: string;
  }
}
