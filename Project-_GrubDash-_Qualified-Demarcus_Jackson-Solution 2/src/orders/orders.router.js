const router = require("express").Router();

const orderController = require("./orders.controller")
// TODO: Implement the /orders routes needed to make the tests pass

router
.route("/")
.get(orderController.list)
.post(orderController.create)
.all(orderController.methodNotAllowed);


router
.route("/:id")
.put(orderController.update)
.get(orderController.read)
.delete(orderController.delete)
.all(orderController.methodNotAllowed);

module.exports = router;