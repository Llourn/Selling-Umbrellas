import { body, param } from "express-validator";
import { CustomerController } from "./controller/CustomerController";

export const Routes = [
  {
    method: "get",
    route: "/topfour",
    controller: CustomerController,
    action: "topFour",
    validation: [],
  },
  {
    method: "get",
    route: "/customers",
    controller: CustomerController,
    action: "all",
    validation: [],
  },
  {
    method: "get",
    route: "/customers/:id",
    controller: CustomerController,
    action: "one",
    validation: [param("id").isInt()],
  },
  {
    method: "post",
    route: "/customers",
    controller: CustomerController,
    action: "save",
    validation: [
      body("name").isString(),
      body("personOfContact").isString(),
      body("phoneNumber").isString(),
      body("location").isString(),
      body("lat").isDecimal(),
      body("lon").isDecimal(),
      body("numberOfEmployees")
        .isInt({ min: 1 })
        .withMessage(
          "Number of employees must be an integer with a value greater than 0."
        ),
    ],
  },
  {
    method: "patch",
    route: "/customers/:id",
    controller: CustomerController,
    action: "save",
    validation: [
      param("id").isInt(),
      body("id").isInt(),
      body("name").isString(),
      body("personOfContact").isString(),
      body("phoneNumber").isString(),
      body("location").isString(),
      body("lat").isDecimal(),
      body("lon").isDecimal(),
      body("numberOfEmployees")
        .isInt({ min: 1 })
        .withMessage(
          "Number of employees must be an integer with a value greater than 0."
        ),
    ],
  },
  {
    method: "delete",
    route: "/customers/:id",
    controller: CustomerController,
    action: "remove",
    validation: [param("id").isInt()],
  },
];
