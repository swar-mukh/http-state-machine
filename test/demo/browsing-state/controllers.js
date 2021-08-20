module.exports = {
    doViewMore: (request, response, clientStateContext) => {
        clientStateContext.calledTimes = (clientStateContext.calledTimes || 0) + 1
        response.writeHead(200, { "Content-Type": "application/json" })
        response.write(JSON.stringify({ data: "doViewMore() called" }))
    },
    doLogout: (request, response, clientStateContext) => {
        response.writeHead(200, { "Content-Type": "application/json" })
        response.write(JSON.stringify({ data: "doLogout() called" }))
    },
    doAddItem: (request, response, clientStateContext) => {
        response.writeHead(200, { "Content-Type": "application/json" })
        response.write(JSON.stringify({ data: "doAddItem() called" }))
    }
}