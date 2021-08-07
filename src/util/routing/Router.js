const Route = require("./Route")

const Router = {
    // connect: path => new Route("CONNECT", path),
    delete: path => new Route("DELETE", path),
    get: path => new Route("GET", path),
    head: path => new Route("HEAD", path),
    // options: path => new Route("OPTIONS", path),
    patch: path => new Route("PATCH", path),
    post: path => new Route("POST", path),
    put: path => new Route("PUT", path),
    // trace: path => new Route("TRACE", path),
}

module.exports = Router