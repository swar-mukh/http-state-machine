const State = require("../lib/State.js")
const { BooleanTransition, SelfTransition, Transition } = require("../lib/Transitions.js")

const initialState = new State("INITIAL_STATE")
const browsingState = new State("BROWSING_STATE")
const cartState = new State("CART_STATE")
const orderState = new State("ORDER_STATE")

const doLogin = () => { console.log("doLogin() called"); return false }
const doViewMore = () => console.log("doViewMore() called")
const doLogout = () => console.log("doLogout() called")
const doAddItem = () => console.log("doAddItem() called")
const doClearCart = () => console.log("doClearCart() called")
const doCheckout = () => console.log("doCheckout() called")
const doViewCart = () => console.log("doViewCart() called")
const doCancelOrder = () => console.log("doCancelOrder() called")
const doMakePayment = () => console.log("doMakePayment() called")

initialState.addEvent("login", new BooleanTransition(doLogin, browsingState, initialState))

browsingState.addEvent("view-more", new SelfTransition(doViewMore))
browsingState.addEvent("logout", new Transition(doLogout, initialState))
browsingState.addEvent("add-item-to-cart", new Transition(doAddItem, cartState))

cartState.addEvent("view-more", new Transition(doViewMore, browsingState))
cartState.addEvent("clear-cart", new Transition(doClearCart, browsingState))
cartState.addEvent("checkout", new Transition(doCheckout, orderState))

orderState.addEvent("view-cart", new Transition(doViewCart, cartState))
orderState.addEvent("cancel-order", new Transition(doCancelOrder, browsingState))
orderState.addEvent("make-payment", new Transition(doMakePayment, browsingState))

module.exports = { initialState }