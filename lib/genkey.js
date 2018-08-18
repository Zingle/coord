const {randomBytes} = require("crypto");

/**
 * Generate a random key.
 * @returns {string}
 */
function genkey() {
    return randomBytes(16).toString("hex");
}

module.exports = genkey;
