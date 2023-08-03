import { config } from 'dotenv';

export interface EnvVars {
    LAUNCHDARKLY_KEY?: string;
    GLOBAL_HASH_SECRET: string;
}

const variables = config().parsed as Partial<EnvVars>;

export const envVars: EnvVars = {
    ...variables
} as EnvVars;
