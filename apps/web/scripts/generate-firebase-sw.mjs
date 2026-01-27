import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATE_PATH = path.join(__dirname, 'firebase-messaging-sw.template.js');
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'firebase-messaging-sw.js');
const ENV_PATHS = [
  path.join(__dirname, '..', '.env'),
  path.join(__dirname, '..', '.env.local'),
];

const REQUIRED_KEYS = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const env = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('#')) continue;
    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex < 0) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (!key) continue;
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }

  return env;
}

function loadEnv() {
  const fileEnv = ENV_PATHS.reduce((acc, envPath) => {
    return { ...acc, ...parseEnvFile(envPath) };
  }, {});

  return { ...fileEnv, ...process.env };
}

function ensureRequired(env) {
  const missing = REQUIRED_KEYS.filter((key) => !env[key]);
  if (missing.length === 0) return;

  console.error('[generate-firebase-sw] Missing env:', missing.join(', '));
  process.exit(1);
}

function buildFirebaseConfig(env) {
  const config = {
    apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  if (env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID) {
    config.measurementId = env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;
  }

  return config;
}

function writeServiceWorker(template, config) {
  const placeholder = '__FIREBASE_CONFIG__';
  if (!template.includes(placeholder)) {
    console.error('[generate-firebase-sw] Template missing placeholder:', placeholder);
    process.exit(1);
  }

  const output = template.replace(placeholder, JSON.stringify(config, null, 2));
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, output, 'utf8');
}

const env = loadEnv();
ensureRequired(env);

const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
const config = buildFirebaseConfig(env);
writeServiceWorker(template, config);

console.info('[generate-firebase-sw] Generated firebase-messaging-sw.js');
