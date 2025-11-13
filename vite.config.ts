import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const normalizeBasePath = (value?: string) => {
  if (!value || value === '/') return '/';
  let normalized = value;
  if (!normalized.startsWith('/')) {
    normalized = `/${normalized}`;
  }
  if (!normalized.endsWith('/')) {
    normalized = `${normalized}/`;
  }
  return normalized.replace(/\/{2,}/g, '/');
};

const detectGithubPagesBase = () => {
  const repo = process.env.GITHUB_REPOSITORY;
  const inActions = process.env.GITHUB_ACTIONS === 'true' || !!process.env.GITHUB_ACTIONS;
  if (!repo || !inActions) return undefined;
  const [, name] = repo.split('/');
  return name ? `/${name}/` : undefined;
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const explicitBase = env.VITE_BASE_PATH?.trim();
  const ciBase = detectGithubPagesBase();
  const base = normalizeBasePath(explicitBase || ciBase || '/');

  return {
    base,
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
