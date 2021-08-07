const Route = require("./Route")

const Router = {
    get: path => new Route("GET", path),
    post: path => new Route("POST", path)
}

module.exports = Router