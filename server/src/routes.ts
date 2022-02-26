import {CustomerController} from "./controller/UserController";

export const Routes = [{
    method: "get",
    route: "/customers",
    controller: CustomerController,
    action: "all"
}, {
    method: "get",
    route: "/customers/:id",
    controller: CustomerController,
    action: "one"
}, {
    method: "post",
    route: "/customers",
    controller: CustomerController,
    action: "save"
}, {
    method: "delete",
    route: "/customers/:id",
    controller: CustomerController,
    action: "remove"
}];