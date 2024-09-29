const express = require('express');
const fs = require('node:fs');
const path = require('node:path');
const mime = require('mime-types');
const interfaces = require('os').networkInterfaces();
const app = express();

/* A boolean that determines what to use. True for local IPv4, false for localhost */
const serverType = false;

/**
 * Get the current computer's local IPv4 and return it.
 * @returns {String}
 */
function getIPv4() {
    for (let devName in interfaces) {
        let iface = interfaces[devName];

        if (iface) {
            for (let i = 0; i < iface.length; i++) {
                let alias = iface[i];
                if (alias && alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                    return alias.address;
                }
            }
        }
    }; return '127.0.0.1';
};

const PORT = 80;
const ip = serverType ? getIPv4() : '127.0.0.1';

app.listen(PORT, ip, () => {
    console.log(`The server is now running on http://${ip}:${PORT}`);
});

app.get('*', (req, res, next) => {
    const filePath = path.join(__dirname, (!req.originalUrl.slice(1).length ? 'index.html' : req.originalUrl));
    let requestedFileExists = false;

    if (fs.existsSync(filePath)) {
        res.set('Content-Type', mime.lookup(filePath) ?? 'text/plain');
        res.send(fs.readFileSync(filePath));
        requestedFileExists = true;
    } else {
        next();
    }

    console.info(`Client ${req.ip} requested ${req.originalUrl.slice(1).length ? req.originalUrl : 'index.html'}${requestedFileExists ? '' : ', but the resource does not exist.'}`);
});

app.get('*', (_, res) => {
    res.set('Content-Type', 'text/html'); res.status(200).send('Hello 404 and fuck you!');
});
