const defaultStateMachineConfiguration = {
    suppressHateoas: false,
    hateoasAttributeName: "hateoas"
}

function StateMachine(configuration = defaultStateMachineConfiguration) {
    this.configuration = configuration
}

StateMachine.prototype = {
    next: function ({ request, response }, client) {
        if (client.currentState.getApplicableEvents().includes(request.url.pathname)) {

            client.currentState.onExit()

            const transitionObject = client.currentState.events.get(request.url.pathname)

            switch (transitionObject.type) {
                case "normal": {
                    transitionObject.action(request, response)
                    client.currentState = transitionObject.transitionTo
                    break
                }
                case "self": {
                    transitionObject.action(request, response)
                    break
                }
                case "boolean": {
                    if (transitionObject.action(request, response)) {
                        client.currentState = transitionObject.transitionToOnSuccess
                    } else {
                        client.currentState = transitionObject.transitionToOnFailure
                    }
                    break
                }
                default: { }
            }

            client.currentState.onEntry()
            client.currentState.invoke()

            if (!this.configuration.suppressHateoas) {
                response.write(JSON.stringify({ hateoas: client.currentState.getApplicableEvents() }))
            }
        } else {
            response.writeHead(404, {
                "Content-Type": "application/json"
            })
            response.write(JSON.stringify({
                message: "Invalid Path!",
                hateoas: client.currentState.getApplicableEvents()
            }))
        }

        response.end()
    }
}

module.exports = StateMachine