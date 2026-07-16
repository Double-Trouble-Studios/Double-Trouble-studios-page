// Tämä on sinun oma, itse tehty palvelimesi!
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const FILE_PATH = path.join(__dirname, 'subscribers.txt');

const server = http.createServer((req, res) => {
    // Sallitaan nettisivun lähettää tietoa palvelimelle turvallisesti
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Kun nettisivulta lähetetään sähköposti (POST-pyyntö)
    if (req.method === 'POST' && req.url === '/subscribe') {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const email = data.email;

                if (email) {
                    // Tallennetaan sähköposti tiedostoon nimeltä 'subscribers.txt'
                    // \n tekee uuden rivin, eli jokainen sähköposti menee omalle rivilleen
                    fs.appendFileSync(FILE_PATH, email + '\n');
                    
                    console.log(`Uusi tilaaja tallennettu: ${email}`);
                    
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ status: 'success', message: 'Tallennettu!' }));
                } else {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ status: 'error', message: 'Sähköposti puuttuu' }));
                }
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'error', message: 'Palvelinvirhe' }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

// Käynnistetään palvelin porttiin 3000
server.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🔥 DOUBLE TROUBLE STUDIOS - PALVELIN KÄYNNISSÄ!`);
    console.log(`Palvelin kuuntelee osoitteessa: http://localhost:${PORT}`);
    console.log(`Sähköpostit tallentuvat tiedostoon: subscribers.txt`);
    console.log(`====================================================`);
});