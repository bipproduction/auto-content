import { chromium } from 'playwright';
import mqttClient from '@/util/mqttClient';
import { evn } from '@/util/evn';

let isRunning = false;

evn.on('running', (value) => {
    isRunning = value
})

evn.on("play", (data) => {
    mqttClient.publish("play", data.toString())
})

export async function GET() {
    if (isRunning) {
        return Response.json({
            message: 'please wait already running ...',
        });
    }
    get();
    return Response.json({
        message: 'running ...',
    });
}


async function get() {
    try {
        evn.emit('running', true)
        evn.emit('play', 'running ...')
        // Memulai browser (dalam contoh ini, menggunakan Chromium)
        const browser = await chromium.launch({ headless: false });
        const context = await browser.newContext();

        // Membuka halaman web
        const page = await context.newPage();
        const url = "https://shopee.co.id/"
        evn.emit('play', `go to ${url}`)
        await page.goto(url);

        // Mengambil teks dari elemen tertentu (misalnya, <h1>)
        evn.emit('play', 'get h1')
        const headingText = await page.textContent('h1');
        console.log(`Teks dari elemen h1: ${headingText}`);

        // Menutup browser
        evn.emit('play', 'close')
        await browser.close();
    } catch (error: any) {
        evn.emit('play', error.toString())
        evn.emit('running', false)
        console.error(error);
    } finally {
        evn.emit('play', 'done')
        evn.emit('running', false)
        console.log('done');
    }
}
