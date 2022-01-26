const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

const dishExists = (req, res, next) => {
  const dishID = req.params.id;
  const foundDish = dishes.find((dish) => dish.id === dishID);
  if (foundDish) {
    res.locals.foundDish = foundDish
    return next();
  } else {
    return next({
      status: 404,
      message: `Dish id not found: ${req.params.id}`,
    });
  }
};

const dishExistsDelete = (req, res, next) => {
  const dishID = req.params.id;
  const foundDish = dishes.find((dish) => dish.id === dishID);
  if (foundDish) {
    return next({
      status: 405,
      message: `Dish id not found: ${req.params.id}`,
    });
  } else {
    return next({
      status: 405,
      message: `Dish id found: ${req.params.id}`,
    });
  }
};

function read(req, res, next) {
  const { foundDish } = res.locals;
  res.json({ data: foundDish });
}

const validateFields = (req, res, next) => {
  const { data: { name, description, image_url, price, id } = {} } = req.body;
  if (id !== req.params.id) {
    if (!id) {
      nameValidation(name, description, image_url, price, next)
    }
    else {
      return next({ status: 400, message: `Dish id does not match route id. Dish: ${id}, Route: ${req.params.id}` });
    }
  }
  else {
    nameValidation(name, description, image_url, price, next)
  };
}

// price validation function
function validatepriceField(price, next) {
  if (price) {
    if (Number.isInteger(price)) {

      if (price >= 0) {
        return next();
      }
      else {
        return next({ status: 400, message: "Dish must have a price that is an integer greater than 0" })
      }
    }
    else {
      return next({ status: 400, message: "Dish must have a price that is an integer greater than 0" })
    }

  }
  else {
    return next({ status: 400, message: "Dish must include a price" })
  }
}

// image_url validation function
function image_urlValidation(image_url, price, next) {
  if (image_url) {
    validatepriceField(price, next)
  }
  else {
    return next({ status: 400, message: "Dish must include a image_url" })
  }
}

// description validation function
function descriptionValidation(description, image_url, price, next) {
  if (description) {
    image_urlValidation(image_url, price, next)
  }
  else {
    return next({ status: 400, message: "Dish must include a description" });
  }
}

// Name validation function
function nameValidation(name, description, image_url, price, next) {
  if (name) {
    descriptionValidation(description, image_url, price, next)
  }
  else {
    return next({ status: 400, message: "Dish must include a name" });
  }
}



//CRUDL Functions
function create(req, res, next) {
  const { data: { name, description, image_url, price } = {} } = req.body;
  const newDish = {
    id: nextId(), // Assign the next ID
    name,
    description,
    image_url,
    price
  };
  dishes.push(newDish);
  res.status(201).json({ data: newDish });
}

function update(req, res, next) {
  const { foundDish } = res.locals;
  const { data: { name, description, image_url, price, id } = {} } = req.body;
  foundDish.name = name
  foundDish.description = description
  foundDish.image_url = image_url
  foundDish.price = price
  res.json({ data: foundDish })

}


function list(req, res, next) {
  res.json({ data: dishes });
}

function destroy(req, res, next) {
  res.sendStatus(204)
}

// The 405 handler
const methodNotAllowed = (req, res, next) => res.status(405).send();

module.exports = {
  create: [validateFields, create],
  read: [dishExists, read],
  update: [dishExists, validateFields, update],
  delete: [dishExistsDelete, destroy],
  list,
  methodNotAllowed
}