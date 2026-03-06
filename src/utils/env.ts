import { loadEnvFile } from 'node:process';

export function loadEnvFileFN() {
  try {
    return loadEnvFile('.env');
  } catch (error) {
    console.error('Error loading environment variables:', error);
  }
}
