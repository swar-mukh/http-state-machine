function StateMachine(initialState) {
    this.currentState = initialState
}

StateMachine.prototype = {
    next: function (event, payload) {
        let response = {}

        if (this.currentState.getApplicableEvents().includes(event)) {

            this.currentState.onExit()

            const transitionObject = this.currentState.events.get(event)

            switch (transitionObject.type) {
                case "normal": {
                    transitionObject.action(payload)
                    this.currentState = transitionObject.transitionTo
                    break
                }
                case "self": {
                    transitionObject.action(payload)
                    break
                }
                case "boolean": {
                    if (transitionObject.action(payload)) {
                        this.currentState = transitionObject.transitionToOnSuccess
                    } else {
                        this.currentState = transitionObject.transitionToOnFailure
                    }
                    break
                }
                default: { }
            }

            this.currentState.onEntry()
            response = this.currentState.invoke()
        } else {
            response = { message: "Invalid request!" }
        }

        return response
    }
}

module.exports = StateMachine