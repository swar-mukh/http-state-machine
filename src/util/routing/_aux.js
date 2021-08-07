module.exports = {
    extractParameters: path => path.match(/(\:\w+)/g)?.map(p => p.substring(1)),
    extractVariables: (path, requestPath) =>
        new RegExp(path?.replace(/\//g, '\\/')?.replace(/\:\w+/g, "([\\w\\-]+)") + "$")
            .exec(requestPath)
            ?.slice(1)
}