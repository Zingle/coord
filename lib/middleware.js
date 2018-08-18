const {Router} = require("express");
const resource = require("./resource");

/**
 * Create director daemon middleware.
 * @returns {function}
 */
function middleware() {
    const middleware = new Router();
    const resources = new Map();

    middleware.param("resource", (req, res, next, id) => {
        req.resource = resource(id);
        next();
    });

    middleware.get("/res/:resource", hasres(), (req, res) => {
        const {status} = req.resource;
        res.json({status});
    });

    middleware.post("/mutex/:resource", expires(), (req, res, next) => {
        const {resource} = req;
        const expires = new Date(req.get("expires"));

        if (resource) {
            res.status(503).send("Service Unavailable");
        } else {
            const mutex =
            resources.set(req.params.resource, {mutex})
        }
    });

    // create middleware to skip route if resource was not found
    function hasres() {
        return (req, res, next) => {
            if (req.resource) next();
            else next("route");
        };
    }

    // create middleware to reject route if Expires header not set
    function expires(max=1000*60*60*4) {
        return (req, res, next) => {
            const expires = req.get("expires");

            if (!expires) {
                res.status(400).send("Must Expire");
            } else if (new Date(expires).getTime() - Date.now() > max) {
                res.status(400).send("Expiry Too Far-Off");
            } else {
                next();
            }
        };
    }

    return (req, res, next) {

    };
}

module.exports = middleware;
