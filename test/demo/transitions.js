const {
    State,
    Transitions: { BooleanTransition, SelfTransition, Transition },
    util: { Router }
} = require("../../src")

const initialStateController = require("./initial-state/controllers.js")
const browsingStateController = require("./browsing-state/controllers.js")
const cartStateController = require("./cart-state/controllers.js")
const orderStateController = require("./order-state/controllers.js")

const initialState = new State("INITIAL_STATE")
const browsingState = new State("BROWSING_STATE")
const cartState = new State("CART_STATE")
const orderState = new State("ORDER_STATE")

initialState.addEvent(Router.get("/login"), new BooleanTransition(initialStateController.doLogin, browsingState, initialState))
initialState.addEvent(Router.get("/auth/:name/forgot-password/:actionId"), new BooleanTransition(initialStateController.doLogin, browsingState, initialState))
initialState.addEvent(Router.get("/auth/:name"), new BooleanTransition(initialStateController.doLogin, browsingState, initialState))

browsingState.addEvent(Router.get("/view-more"), new SelfTransition(browsingStateController.doViewMore))
browsingState.addEvent(Router.get("/logout"), new Transition(browsingStateController.doLogout, initialState))
browsingState.addEvent(Router.get("/add-item-to-cart"), new Transition(browsingStateController.doAddItem, cartState))

cartState.addEvent(Router.get("/view-more"), new Transition(browsingStateController.doViewMore, browsingState))
cartState.addEvent(Router.get("/clear-cart"), new Transition(cartStateController.doClearCart, browsingState))
cartState.addEvent(Router.get("/checkout"), new Transition(cartStateController.doCheckout, orderState))

orderState.addEvent(Router.get("/view-cart"), new Transition(orderStateController.doViewCart, cartState))
orderState.addEvent(Router.get("/cancel-order"), new Transition(orderStateController.doCancelOrder, browsingState))
orderState.addEvent(Router.get("/make-payment"), new Transition(orderStateController.doMakePayment, browsingState))

module.exports = { initialState }