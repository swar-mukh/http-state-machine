module.exports = {
    doClearCart: (request, response) => {
        response.writeHead(200, { "Content-Type": "application/json" })
        response.write(JSON.stringify({ data: "doClearCart() called" }))
    },
    doCheckout: (request, response) => {
        response.writeHead(200, { "Content-Type": "application/json" })
        response.write(JSON.stringify({ data: "doCheckout() called" }))
    }
}