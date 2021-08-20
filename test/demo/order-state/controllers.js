module.exports = {
    doViewCart: (request, response, clientStateContext) => {
        response.writeHead(200, { "Content-Type": "application/json" })
        response.write(JSON.stringify({ data: "doViewCart() called" }))
    },
    doCancelOrder: (request, response, clientStateContext) => {
        response.writeHead(200, { "Content-Type": "application/json" })
        response.write(JSON.stringify({ data: "doCancelOrder() called" }))
    },
    doMakePayment: (request, response, clientStateContext) => {
        response.writeHead(200, { "Content-Type": "application/json" })
        response.write(JSON.stringify({ data: "doMakePayment() called" }))
    }
}