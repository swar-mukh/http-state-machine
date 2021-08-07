const StateMachine = require("./lib/StateMachine.js")
const State = require("./lib/State.js")
const Transitions = require("./lib/Transitions.js")
const ClientState = require("./lib/ClientState.js")

const HttpIO = require("./util/httpIO/HttpIO")
const Router = require("./util/routing/Router")

const util = {
    simplifyRequest: HttpIO.simplifyRequest,
    Router
}

module.exports = {
    StateMachine,
    State,
    Transitions,
    ClientState,
    util
}