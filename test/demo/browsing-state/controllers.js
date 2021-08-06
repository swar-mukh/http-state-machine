module.exports = {
    doViewMore: (request, response) => {
        response.writeHead(200, { "Content-Type": "application/json" })
        response.write(JSON.stringify({ data: "doViewMore() called" }))
    },
    doLogout: (request, response) => {
        response.writeHead(200, { "Content-Type": "application/json" })
        response.write(JSON.stringify({ data: "doLogout() called" }))
    },
    doAddItem: (request, response) => {
        response.writeHead(200, { "Content-Type": "application/json" })
        response.write(JSON.stringify({ data: "doAddItem() called" }))
    }
}