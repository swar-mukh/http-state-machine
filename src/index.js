const StateMachine = require("./lib/StateMachine")
const State = require("./lib/State")
const Transitions = require("./lib/Transitions")
const ClientState = require("./lib/ClientState")

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