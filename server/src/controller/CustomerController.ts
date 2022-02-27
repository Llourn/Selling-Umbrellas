import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { Customer } from "../entity/Customer";

export class CustomerController {
  private customerRepository = getRepository(Customer);

  async all(request: Request, response: Response, next: NextFunction) {
    let allCustomers = await this.customerRepository.find();
    allCustomers.sort(compareId);
    return allCustomers;
  }

  async topFour(request: Request, response: Response, next: NextFunction) {
    let allCustomers = await this.customerRepository.find();
    allCustomers.sort(compareEmployeeCount);
    let firstFour: Customer[];
    if(allCustomers.length > 4) {
      firstFour = allCustomers.slice(0, 4);
    } else {
      firstFour = allCustomers;
    }
    return firstFour;
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const customer = await this.customerRepository.findOne(request.params.id);
    if (!customer) throw Error("Customer does not exist");
    return customer;
  }

  async save(request: Request, response: Response, next: NextFunction) {
    return this.customerRepository.save(request.body);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const customerToRemove = await this.customerRepository.findOne(
      request.params.id
    );
    if (!customerToRemove) throw Error("Customer does not exist");
    return this.customerRepository.remove(customerToRemove);
  }
}

// sort by id in descending order.
function compareId(a: Customer, b: Customer) {
  if (a.id > b.id) {
    return -1;
  }
  if (a.id < b.id) {
    return 1;
  }
  return 0;
}

function compareEmployeeCount(a: Customer, b: Customer) {
  if (a.numberOfEmployees > b.numberOfEmployees) {
    return -1;
  }
  if (a.numberOfEmployees < b.numberOfEmployees) {
    return 1;
  }
  return 0;
}
