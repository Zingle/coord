const http = require("http");
const express = require("express");
const director = require("./lib/middleware/director");

const app = express();
const server = http.createServer(app);

app.use(director());

app.all("*", (req, res) => {
    if (res.statusCode === 200) {
        res.status(404);
    }

    res.send(res.statusCode === 204 ? "" : http.STATUS_CODES[res.statusCode]);
});

server.listen(2000, () => {
    const {address, port} = server.address();
    console.log(`listening on ${address}:${port}`);
});


scan().then(network => {
    
});
