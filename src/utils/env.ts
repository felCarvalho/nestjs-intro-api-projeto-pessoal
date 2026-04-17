import { loadEnvFile } from 'node:process';
import { existsSync } from 'node:fs';

export function loadEnvFileFN() {
  if (existsSync('.env')) {
    try {
      return loadEnvFile('.env');
    } catch (error) {
      // Silencioso
    }
  }
}
