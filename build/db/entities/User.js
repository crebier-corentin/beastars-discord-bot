"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var User_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typeorm_1 = require("typeorm");
const Context_1 = require("../../Context");
let User = User_1 = class User extends typeorm_1.BaseEntity {
    legsGiven() {
        return this.legsGivenTo.length;
    }
    legsRecieved() {
        return this.legsRecieved.length;
    }
    getDiscordMember(guild) {
        return guild.members.resolve(this.discordId);
    }
    getDiscordUser(guild) {
        return this.getDiscordMember(guild).user;
    }
    async getNickname(guild = null, delimiters = "") {
        if (guild !== null) {
            const member = this.getDiscordMember(guild);
            if (member != undefined) {
                return delimiters + member.displayName + delimiters;
            }
        }
        //Last nickname
        return delimiters + (await Context_1.Context.client.users.fetch(this.discordId)).username + delimiters;
    }
    async getStats(guild) {
        //Legs given
        const toStr = await (async () => {
            if (this.legsGivenTo.length === 0) {
                return "has not given any legs";
            }
            const toNames = [];
            for (const to of this.legsGivenTo) {
                toNames.push(await to.getNickname(guild, "**"));
            }
            return `has given ${toNames.length} leg${toNames.length === 1 ? "" : "s"} to (${toNames.join(", ")})`;
        })();
        //Legs received
        const fromStr = await (async () => {
            if (this.legsReceivedFrom.length === 0) {
                return "has not received any legs";
            }
            const fromNames = [];
            for (const from of this.legsReceivedFrom) {
                fromNames.push(await from.getNickname(guild, "**"));
            }
            return `has received ${fromNames.length} leg${fromNames.length === 1 ? "" : "s"} from (${fromNames.join(", ")})`;
        })();
        return `${await this.getNickname(guild, "**")} ${toStr} and ${fromStr}`;
    }
    async giveLegTo(receiver) {
        this.legsGivenTo.push(receiver);
        await this.save();
        await receiver.reload();
    }
    hasGivenLegTo(receiver) {
        return this.legsGivenTo.find((value) => value.discordId === receiver.discordId) != undefined;
    }
    static async findOrCreate(discordId) {
        let user = await User_1.findOne({ where: { discordId }, relations: ["legsGivenTo", "legsReceivedFrom"] });
        if (user == undefined) {
            user = await User_1.create({ discordId }).save();
            //Load relations
            user = await User_1.findOne(user.id, { relations: ["legsGivenTo", "legsReceivedFrom"] });
        }
        return user;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "discordId", void 0);
__decorate([
    typeorm_1.ManyToMany(() => User_1, (user) => user.legsReceivedFrom, { cascade: true }),
    typeorm_1.JoinTable({
        name: "users_legs",
        joinColumn: {
            name: "from",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "to",
            referencedColumnName: "id",
        },
    }),
    __metadata("design:type", Array)
], User.prototype, "legsGivenTo", void 0);
__decorate([
    typeorm_1.ManyToMany(() => User_1, (user) => user.legsGivenTo),
    __metadata("design:type", Array)
], User.prototype, "legsReceivedFrom", void 0);
User = User_1 = __decorate([
    typeorm_1.Entity()
], User);
exports.User = User;
//# sourceMappingURL=User.js.map