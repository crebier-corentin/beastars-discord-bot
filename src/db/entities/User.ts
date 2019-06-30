import {BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Guild, GuildMember, User as DiscordUser} from "discord.js";

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    discordId: string;

    @ManyToMany(type => User, user => user.legsReceivedFrom, {cascade: true})
    @JoinTable({
        name: "users_legs",
        joinColumn: {
            name: "from",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "to",
            referencedColumnName: "id"
        }
    })
    legsGivenTo: User[];

    @ManyToMany(type => User, user => user.legsGivenTo)
    legsReceivedFrom: User[];

    legsGiven() {
        return this.legsGivenTo.length;
    }

    legsRecieved() {
        return this.legsRecieved.length;
    }

    getDiscordMember(guild: Guild): GuildMember {
        return guild.members.get(this.discordId);
    }

    getDiscordUser(guild: Guild): DiscordUser {
        return this.getDiscordMember(guild).user;
    }

    getStats(guild: Guild): string {

        //Legs given
        const toStr = () => {
            const toNames = [];
            for (const to of this.legsGivenTo) {
                toNames.push(to.getDiscordMember(guild).displayName);
            }

            //Str
            let result = "";
            if (toNames.length > 0) {
                result = `has given ${toNames.length} leg${toNames.length === 1 ? "" : "s"} to (${toNames.join(", ")})`;
            }

            return result;

        };

        //Legs received
        const fromStr = () => {
            const fromNames = [];
            for (const from of this.legsReceivedFrom) {
                fromNames.push(from.getDiscordMember(guild).displayName);
            }

            //Str
            let result = "";
            if (fromNames.length > 0) {
                result = `has received ${fromNames.length} leg${fromNames.length === 1 ? "" : "s"} from (${fromNames.join(", ")})`;
            }

            return result;

        };

        const member = this.getDiscordMember(guild);

        return `${member.displayName} ${toStr()} and ${fromStr()}`;

    }

    async giveLegTo(receiver: User): Promise<void> {
        this.legsGivenTo.push(receiver);

        await this.save();

        await receiver.reload();

    }

    hasGivenLegTo(receiver: User): boolean {
        return this.legsGivenTo.find(value => value.discordId === receiver.discordId) != undefined;
    }

    static async findOrCreate(discordId: string): Promise<User> {

        let user = await User.findOne({where: {discordId}, relations: ["legsGivenTo", "legsReceivedFrom"]});
        if (user == undefined) {
            user = await User.create({discordId}).save();
            //Load relations
            user = await User.findOne(user.id, {relations: ["legsGivenTo", "legsReceivedFrom"]});
        }

        return user;
    }


}