const { State, Transitions } = require("../../src")
const { BooleanTransition, SelfTransition, Transition } = Transitions

const initialStateController = require("./initial-state/controllers.js")
const browsingStateController = require("./browsing-state/controllers.js")
const cartStateController = require("./cart-state/controllers.js")
const orderStateController = require("./order-state/controllers.js")

const initialState = new State("INITIAL_STATE")
const browsingState = new State("BROWSING_STATE")
const cartState = new State("CART_STATE")
const orderState = new State("ORDER_STATE")

initialState.addEvent("/login", new BooleanTransition(initialStateController.doLogin, browsingState, initialState))

browsingState.addEvent("/view-more", new SelfTransition(browsingStateController.doViewMore))
browsingState.addEvent("/logout", new Transition(browsingStateController.doLogout, initialState))
browsingState.addEvent("/add-item-to-cart", new Transition(browsingStateController.doAddItem, cartState))

cartState.addEvent("/view-more", new Transition(browsingStateController.doViewMore, browsingState))
cartState.addEvent("/clear-cart", new Transition(cartStateController.doClearCart, browsingState))
cartState.addEvent("/checkout", new Transition(cartStateController.doCheckout, orderState))

orderState.addEvent("/view-cart", new Transition(orderStateController.doViewCart, cartState))
orderState.addEvent("/cancel-order", new Transition(orderStateController.doCancelOrder, browsingState))
orderState.addEvent("/make-payment", new Transition(orderStateController.doMakePayment, browsingState))

module.exports = { initialState }