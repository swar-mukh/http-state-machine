module.exports = {
    doLogin: (request, response, clientStateContext) => {
        response.writeHead(200, { "Content-Type": "application/json" });
        response.write(JSON.stringify({ data: "doLogin() called" }));
        return true
    }
}