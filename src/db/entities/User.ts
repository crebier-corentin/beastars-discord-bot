import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    discordId: string;

    @Column({default: 2})
    legs: number;

    @Column({default: 0})
    legsEaten: number;

}