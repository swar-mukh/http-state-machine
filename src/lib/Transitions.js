module.exports = {
    Transition: function (action, state, message = "") {
        return {
            type: "normal",
            action,
            transitionTo: state,
            message: message
        }
    },
    SelfTransition: function (action, message = "") {
        return {
            type: "self",
            action,
            message: message
        }
    },
    SuccessfulTransaction: function (state, message = "") {
        return { state, message }
    },
    FailedTransaction: function (state, message = "") {
        return { state, message }
    },
    BooleanTransition: function (action, successfulTransaction, failedTransaction) {
        return {
            type: "boolean",
            action,
            transitionToOnSuccess: successfulTransaction,
            transitionToOnFailure: failedTransaction,
        }
    }
}