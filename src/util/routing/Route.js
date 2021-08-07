const { extractParameters, extractVariables } = require("./_aux")

function Route(method, path = "/") {
    this.method = method
    this.path = path
    this.parameters = extractParameters(path)
}

Route.prototype = {
    match: function (request) {
        return this.method === request.method &&
            (
                (this.path.indexOf(":") === -1 && request.url.pathname.indexOf(":") === -1 && this.path === request.url.pathname) ||
                (extractVariables(this.path, request.url.pathname)?.length > 0)
            )
    },
    getPathVariables: function (request) {
        const map = {}

        if (this.parameters) {
            const variables = extractVariables(this.path, request.url.pathname)

            if (this.parameters.length === variables?.length) {
                this.parameters.forEach((parameter, index) => {
                    map[parameter] = variables[index]
                })
            } else {
                throw Error(`Variable count (${variables?.length}) does not match parameter count (${this.parameters.length})!`)
            }

        } else {
            throw Error("'getPathVariables' called on non-parametric route!")
        }

        return map
    }
}

module.exports = Route