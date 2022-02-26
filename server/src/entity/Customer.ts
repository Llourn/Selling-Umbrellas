import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Customer {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    personOfContact: string;
    
    @Column()
    phoneNumber: string;
    
    @Column()
    location: string;
    
    @Column("double precision")
    lat: number;
    
    @Column("double precision")
    lon: number;

    @Column()
    numberOfEmployees: number;
}
