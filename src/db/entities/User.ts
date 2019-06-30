import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Guild, GuildMember, User as DiscordUser} from "discord.js";

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    discordId: string;

    @Column({default: 2})
    legs: number;

    @Column({default: 0})
    legsOffered: number;

    getDiscordMember(guild: Guild): GuildMember {
        return guild.members.get(this.discordId);
    }

    getDiscordUser(guild: Guild): DiscordUser {
        return this.getDiscordMember(guild).user;
    }

    getStats(guild: Guild): string {

        const member = this.getDiscordMember(guild);

        return `${member.displayName} has ${this.legs} leg(s) left and has eaten ${this.legsOffered} leg(s)!`;

    }

    static async findOrCreate(discordId: string): Promise<User> {

        let user = await User.findOne({where: {discordId}});
        if (user == undefined) {
            user = await User.create({discordId}).save();
        }

        return user;
    }


}