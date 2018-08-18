const bonjour = require("bonjour");
const genkey = require("./genkey");
const {Peer} = require("./peer");
const discover = bonjour();

/**
 * Connect to network.
 * @param {string} [address]
 * @param {number} [port]
 * @returns {Network}
 */
function connect(address="127.0.0.1", port=undefined) {
    const name = genkey();              // name for this peer
    const peers = new Map();            // known peers
    const browser = discover.find({type: "zingle-coord"});
    const server = net.createServer(handshake);

    var local;

    browser.on("up", registerPeer);
    browser.on("down", unregisterPeer);

    server.listen(port, address, () => {
        const {address, port} = server.address();
        local = discover.publish({name, port, type: "zingle-coord"});
        console.log(`listening on ${address}:${port}`);
    });

    function registerPeer(service) {
        const {name} = service;

        // register peer by name if it doesn't exist
        if (!peers.has(name)) {
            peers.set(name, new Peer(name));
            console.log(`peer announced: ${name}`);
        }

        // bind peer and service
        peers.get(name).bindService(service);
    }

    function unregisterPeer(service) {
        const {name} = service;
        console.log(`peer disappeared: ${name}`);
        peers.delete(name);
    }

    function handshake(socket) {
        // decode incoming UTF-8 socket data and process line-by-line
        carry(socket, line => handleRequest(socket, line), "utf8", "\n");

        // identify this peer to connecting peers
        identify(socket, name);
    }

    function identify(socket, name) {
        send(socket, "identify", name);
    }

    function send(socket, ...args) {
        const message = args.join(" ").replace(/\s+/g, " ");
        socket.write(`${message}\n`);
    }

    function error(socket, err) {
        const message = err.replace(/\s+/g, " ");
        socket.write(`error ${message}\n`, () => socket.destroy());
        socket.end();
    }

    function handleRequest(socket, message) {
        const [command, ...args] = message.split(" ");

        switch (command) {
            case "identify":
                handleIdentify(socket, ...args);
                break;
            default:
                error(socket, "unrecognized command");
                break;
        }
    }

    function handleIdentify(socket, name) {
        if (arguments.length < 2) {
            error(socket, "missing name");
        } else if (arguments.length > 2) {
            error(socket, "unexpected argument");
        } else if (!peers.has(name)) {
            peers.set(name, new Peer(name));
            peers.get(name).bindSocket(socket);
            console.log(`peer connected: ${name}`);
        } else if (!peers.get(name).socket) {
            peer.bindSocket(socket);
            console.log(`peer connected: ${name}`);
        } else if (peers.get(name).socket !== socket) {
            error(socket, "already connected");
        } else {
            error(socket, "already identified");
        }
    }
}

module.exports = connect;
