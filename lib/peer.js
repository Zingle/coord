const {freeze, defineProperties} = Object;
const services = new WeakMap();
const sockets = new WeakMap();

/**
 * Network peer.
 * @constructor
 * @param {string} ident
 */
function Peer(ident) {
    this.ident = ident;
    freeze(this);
}

/**
 * Bind peer to a discovered service.
 * @param {object} service
 */
Peer.prototype.bindService = function(service) {
    if (services.has(this)) {
        throw new Error("peer already bound to service");
    }

    services.set(this, service);
};

/**
 * Bind peer to a socket.
 * @param {Socket} socket
 */
Peer.prototype.bindSocket = function(socket) {
    if (sockets.has(this)) {
        throw new Error("peer already bound to socket");
    }

    sockets.set(this, socket);
};

defineProperties(Peer.prototype, {
    /**
     * Bound service for peer.
     * @name Peer#service
     * @type {Socket}
     * @readonly
     */
    service: {
        configurable: true,
        enumerable: true,
        get() {return services.get(this);}
    },

    /**
     * Bound socket for peer.
     * @name Peer#socket
     * @type {Socket}
     * @readonly
     */
    socket: {
        configurable: true,
        enumerable: true,
        get() {return sockets.get(this);}
    }
});

module.exports = {Peer};
