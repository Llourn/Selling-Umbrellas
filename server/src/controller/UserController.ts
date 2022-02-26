import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Customer} from "../entity/Customer";

export class CustomerController {

    private customerRepository = getRepository(Customer);

    async all(request: Request, response: Response, next: NextFunction) {
        return this.customerRepository.find();
    }

    async one(request: Request, response: Response, next: NextFunction) {
        return this.customerRepository.findOne(request.params.id);
    }

    async save(request: Request, response: Response, next: NextFunction) {
        return this.customerRepository.save(request.body);
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        let userToRemove = await this.customerRepository.findOne(request.params.id);
        await this.customerRepository.remove(userToRemove);
    }

}