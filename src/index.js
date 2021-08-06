const StateMachine = require("./lib/StateMachine.js")
const State = require("./lib/State.js")
const Transitions = require("./lib/Transitions.js")
const ClientState = require("./lib/ClientState.js")

const HttpIO = require("./util/HttpIO")

const util = {
    simplifyRequest: HttpIO.simplifyRequest
}

module.exports = {
    StateMachine,
    State,
    Transitions,
    ClientState,
    util
}