import { Browser, BrowserContext, Page, chromium } from 'playwright';
import { evn } from '@/util/evn';
import fs from 'fs';
import path from 'path';
import mqttClient from '@/util/mqttClient';
import 'colors';

var browser: Browser | null = null;
var context: BrowserContext | null = null;
var page: Page | null = null;
var isRunning = false;

mqttClient.on('connect', () => {
    console.log('connected'.green);
})

export async function GET(req: Request) {
    const key = new URL(req.url).searchParams.get('key');
    if (!key) {
        return new Response(JSON.stringify({
            message: 'key not found',
        }), { status: 400 });
    }

    if (isRunning) {
        return new Response(JSON.stringify({
            message: 'please wait already running ...',
        }), { status: 400 });
    }
    get();
    return new Response(JSON.stringify({
        message: 'running ...',
    }));
}

async function get() {
    try {
        evn.emit('running', true);
        evn.emit('play', 'running ...');

        // Memulai browser (dalam contoh ini, menggunakan Chromium)
        if (!browser) {
            browser = await chromium.launch({ headless: false });
        }
        if (!context) {
            context = await browser.newContext();
        }
        if (!page) {
            page = await context.newPage();
        }

        const cookie = fs.readFileSync(path.join(process.cwd(), 'src/assets/cookies.json'));
        await context.addCookies(JSON.parse(cookie.toString()));

        // Membuka halaman web
        const url = 'https://shopee.co.id/';
        evn.emit('play', `go to ${url}`);
        await page.goto(url);

        evn.on('save/cookies', async (data) => {
            console.log("save/cookies");
            const cookies = await context!.cookies();
            fs.writeFileSync(path.join(process.cwd(), 'src/assets/cookies.json'), JSON.stringify(cookies, null, 2));
            evn.emit('play', 'save cookies');
        });

        // Menutup browser
        evn.emit('play', 'close');
    } catch (error: any) {
        evn.emit('play', error.toString());
        console.error(error);
    } finally {
        // if (browser) {
        //     await browser.close();
        //     browser = null;
        //     context = null;
        //     page = null;
        // }

        evn.emit('play', 'done');
        evn.emit('running', false);
        console.log('done');
    }
}
