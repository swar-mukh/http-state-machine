const { StateMachine } = require("../src")

const { initialState } = require("./myTransitions.js")

const sessionManager = new Map()

const listener = (sessionId, event, payload = {}) => {
    const stateMachine = sessionManager.get(sessionId)

    if (stateMachine) {
        const response = stateMachine.next(event, payload)
        console.log({ ...response, hateoas: stateMachine.currentState.getApplicableEvents() })
    } else {
        const newStateMachine = new StateMachine(initialState)

        sessionManager.set(sessionId, newStateMachine)

        console.log({ hateoas: newStateMachine.currentState.getApplicableEvents() })
    }
}

module.exports = { sessionManager, listener, initialState }