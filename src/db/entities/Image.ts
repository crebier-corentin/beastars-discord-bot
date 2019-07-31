import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import {User} from "./User";

@Entity()
export class Image extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    name: string;

    @Column()
    url: string;

    @ManyToOne(type => User, {eager: true})
    addedBy: User;

    @CreateDateColumn()
    createdAt: string;
}