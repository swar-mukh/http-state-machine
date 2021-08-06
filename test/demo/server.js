const http = require("http")

const { StateMachine, ClientState, util } = require("../../src")

const { initialState } = require("./transitions.js")

const sessionManager = new Map()
const stateMachine = new StateMachine(initialState)

const server = http.createServer(async (request, response) => {
    const simplifiedRequest = await util.simplifyRequest(request)
    
    const sessionId = simplifiedRequest.headers.cookie.get("sessId")
    const clientState = sessionManager.get(sessionId)

    if (clientState) {
        stateMachine.next({ request: simplifiedRequest, response }, clientState)
    } else {
        const newClient = new ClientState(initialState, {})
        const newSessionId = parseInt(Math.random() * 1000)

        sessionManager.set(Number(newSessionId).toString(), newClient)
        response.setHeader('Set-Cookie', [`sessId=${newSessionId}`])

        simplifiedRequest.headers.cookie.set("sessId", newSessionId)

        stateMachine.next({ request: simplifiedRequest, response }, newClient)
    }
})

server.listen(8080, "0.0.0.0", () => console.info(`Server up and running in `, server.address()))


module.exports = { sessionManager, initialState }