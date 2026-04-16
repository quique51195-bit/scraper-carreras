const express = require('express');
const puppeteer = require('puppeteer');
const app = express();

app.get('/extraer', async (req, res) => {
    const urlDestino = req.query.url;
    if (!urlDestino) return res.status(400).send('Falta la URL');

    try {
        const browser = await puppeteer.launch({
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH, // ¡La línea mágica para Docker!
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox', 
                '--disable-dev-shm-usage',
                '--disable-gpu'
            ]
        });
        const page = await browser.newPage();
        
        await page.goto(urlDestino, { waitUntil: 'networkidle2', timeout: 60000 });
        const html = await page.content();
        await browser.close();
        
        res.send(html);
    } catch (error) {
        res.status(500).send('Error extrayendo la web: ' + error.message);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Scraper funcionando en puerto ${PORT}`));
