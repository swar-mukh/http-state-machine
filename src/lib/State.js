function State(name) {
    this.name = name
    this.events = []
}

State.prototype = {
    onEntry: function (callbackFn) { callbackFn ? callbackFn() : console.log(`Entry handler for '${this.name}' state called`) },
    onExit: function (callbackFn) { callbackFn ? callbackFn() : console.log(`Exit handler for '${this.name}' state called`) },

    invoke: function (callbackFn) { return callbackFn ? callbackFn() : { resp: `Inside '${this.name}' state` } },

    addEvent: function (route, transition, guardFn = (_req, _csx) => true) {
        this.events.push({ route, transition, guardFn })
    },
    getEvent: function (request, clientStateContext) {
        const event = this.events.find(event => event.guardFn(request, clientStateContext) && event.route.match(request))

        if (event?.route.parameters) {
            request.url.pathParams = event.route.getPathVariables(request)
        }

        return event
    },
    getApplicableEvents: function (request, clientStateContext) {
        return this.events
            .filter(event => event.guardFn(request, clientStateContext))
            .map(event => ({
                method: event.route.method,
                path: event.route.path
            }))
    }
}

module.exports = State
