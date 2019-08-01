import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import {User} from "./User";
import {Guild} from "discord.js";

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
    createdAt: Date;

    info(guild: Guild): string {
        const addedbyMember = this.addedBy.getDiscordMember(guild);

        return `${this.name} (<${this.url}>) added ${this.createdAt.toISOString()} by **${addedbyMember.displayName}** (${addedbyMember.user.username}#${addedbyMember.user.discriminator})`;
    }

    static findImage(name: string): Promise<Image | undefined> {
        return Image.createQueryBuilder("image")
            .leftJoinAndSelect("image.addedBy", "addedBy")
            .where("LOWER(image.name) = LOWER(:name)", {name})
            .getOne();
    }

    static async nameExist(name: string): Promise<boolean> {
        return await Image.createQueryBuilder("image")
            .where("LOWER(image.name) = LOWER(:name)", {name})
            .getCount() > 0;
    }
}