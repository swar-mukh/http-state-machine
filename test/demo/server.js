const http = require("http")

const { StateMachine, ClientState, util } = require("../../src")

const { initialState } = require("./transitions.js")

const sessionManager = new Map()
const stateMachine = new StateMachine()

const args = new Map(process.argv.slice(2).map(argument => argument.split("=")))

const handler = async (request, response) => {
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
}

if (Array.from(args.keys()).includes("--help")) {
    console.log("Usage:\n")
    console.log("demo host='<hostId>' port=<portNumber>\n")
    console.log("hostId:\t0.0.0.0\t(Default)")
    console.log("port  :\t8080\t(Default)\n")
} else {
    console.log("Type 'demo --help' from terminal for more info\n")

    const server = http.createServer(handler)
    
    server.once("error", err => console.error("Error encountered:", err.message))
    
    server.listen(args.get("port") || 8080, args.get("host") || "0.0.0.0", () => console.info(`Server up and running in `, server.address()))
}

module.exports = { sessionManager, initialState }