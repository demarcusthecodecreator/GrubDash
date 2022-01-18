const router = require("express").Router();
const controller = require("./dishes.controller")
// TODO: Implement the /dishes routes needed to make the tests pass




router
.route("/")
.get(controller.list)
.post(controller.create)
.all(controller.methodNotAllowed);

router
.route("/:id")
.get(controller.read)
.put(controller.update)
.delete(controller.delete)
.all(controller.methodNotAllowed);

module.exports = router;