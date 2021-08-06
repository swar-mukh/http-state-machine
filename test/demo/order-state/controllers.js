module.exports = {
    doViewCart: (request, response) => {
        response.writeHead(200, { "Content-Type": "application/json" })
        response.write(JSON.stringify({ data: "doViewCart() called" }))
    },
    doCancelOrder: (request, response) => {
        response.writeHead(200, { "Content-Type": "application/json" })
        response.write(JSON.stringify({ data: "doCancelOrder() called" }))
    },
    doMakePayment: (request, response) => {
        response.writeHead(200, { "Content-Type": "application/json" })
        response.write(JSON.stringify({ data: "doMakePayment() called" }))
    }
}