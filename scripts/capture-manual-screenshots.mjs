import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const outDir = path.join(root, 'docs', 'manual', 'screens');
const baseUrl = process.env.VBX_WEB_URL ?? 'http://127.0.0.1:5173';

await fs.mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1600 }, deviceScaleFactor: 1 });

async function shot(name) {
  await page.screenshot({ path: path.join(outDir, name), fullPage: true });
}

await page.goto(baseUrl, { waitUntil: 'networkidle' });
await shot('welcome.png');

await page.getByRole('button', { name: 'Comenzar' }).click();
await shot('profile.png');

await page.getByRole('button', { name: 'Seguir' }).click();
await shot('credentials.png');

await page.getByRole('button', { name: 'Seguir' }).last().click();
await shot('biometric.png');

await page.getByRole('button', { name: 'Activar y entrar' }).click();
await page.waitForSelector('text=Panel principal');
await shot('dashboard.png');

await page.getByRole('button', { name: 'Chat' }).click();
await shot('assistant.png');

await browser.close();
