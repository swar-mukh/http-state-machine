function State(name) {
    this.name = name
    this.events = new Map()
}

State.prototype = {
    onEntry: function (callbackFn) { callbackFn ? callbackFn() : console.log(`Entry handler for '${this.name}' state called`) },
    onExit: function (callbackFn) { callbackFn ? callbackFn() : console.log(`Exit handler for '${this.name}' state called`) },

    invoke: function (callbackFn) { return callbackFn ? callbackFn() : { resp: `Inside '${this.name}' state` } },

    addEvent: function (name, transition) {
        this.events.set(name, transition)
    },
    getApplicableEvents: function () {
        return Array.from(this.events.keys())
    }
}

module.exports = State
