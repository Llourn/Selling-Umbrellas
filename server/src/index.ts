import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import { Routes } from "./routes";
import { Customer } from "./entity/Customer";
import { port } from "./config";
import * as cors from "cors";

createConnection()
  .then(async (connection) => {
    // create express app
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());
    // register express routes from defined application routes
    Routes.forEach((route) => {
      (app as any)[route.method](
        route.route,
        async (req: Request, res: Response, next: Function) => {
          try {
            const result = await new (route.controller as any)()[route.action](
              req,
              res,
              next
            );
            res.json(result);
          } catch (error) {
            next(error);
          }
        }
      );
    });

    // setup express app here
    // ...

    // start express server
    app.listen(port);

    // insert new users for test
    await connection.manager.save(
      connection.manager.create(Customer, {
        name: "Bell",
        personOfContact: "Charles Switch",
        phoneNumber: "506-345-0192",
        location: "Fredericton NB",
        lat: 45,
        lon: -66,
        numberOfEmployees: 4245,
      })
    );
    await connection.manager.save(
      connection.manager.create(Customer, {
        name: "Sobeys",
        personOfContact: "Jo Burdundy",
        phoneNumber: "506-456-0221",
        location: "Fredericton NB",
        lat: 45,
        lon: -66,
        numberOfEmployees: 459,
      })
    );

    console.log(`Express server has started on port ${port}.`);
  })
  .catch((error) => console.log(error));
