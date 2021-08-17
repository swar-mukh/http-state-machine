const defaultStateMachineConfiguration = {
    suppressHateoas: false,
    hateoasAttributeName: "hateoas"
}

function StateMachine(configuration = defaultStateMachineConfiguration) {
    this.configuration = configuration
}

StateMachine.prototype = {
    next: function ({ request, response }, clientState) {
        const event = clientState.currentState.getEvent(request, clientState.context)

        if (event) {
            clientState.currentState.onExit()

            const transitionObject = event.transition

            switch (transitionObject.type) {
                case "normal": {
                    transitionObject.action(request, response, clientState.context)
                    clientState.currentState = transitionObject.transitionTo
                    break
                }
                case "self": {
                    transitionObject.action(request, response, clientState.context)
                    break
                }
                case "boolean": {
                    if (transitionObject.action(request, response, clientState.context)) {
                        clientState.currentState = transitionObject.transitionToOnSuccess
                    } else {
                        clientState.currentState = transitionObject.transitionToOnFailure
                    }
                    break
                }
                default: { }
            }

            clientState.currentState.onEntry()
            clientState.currentState.invoke()

            if (!this.configuration.suppressHateoas) {
                response.write(JSON.stringify({ [this.configuration.hateoasAttributeName]: clientState.currentState.getApplicableEvents(request, clientState.context) }))
            }
        } else {
            response.writeHead(404, {
                "Content-Type": "application/json"
            })
            response.write(JSON.stringify({
                message: "Invalid Path!",
                [this.configuration.hateoasAttributeName]: clientState.currentState.getApplicableEvents(request, clientState.context)
            }))
        }

        response.end()
    }
}

module.exports = StateMachine