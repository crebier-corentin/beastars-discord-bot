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
const typeorm_1 = require("typeorm");
let User = User_1 = class User extends typeorm_1.BaseEntity {
    legsGiven() {
        return this.legsGivenTo.length;
    }
    legsRecieved() {
        return this.legsRecieved.length;
    }
    getDiscordMember(guild) {
        return guild.members.get(this.discordId);
    }
    getDiscordUser(guild) {
        return this.getDiscordMember(guild).user;
    }
    getStats(guild) {
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
    async giveLegTo(receiver) {
        this.legsGivenTo.push(receiver);
        this.save();
        receiver.reload();
    }
    static async findOrCreate(discordId) {
        let user = await User_1.findOne({ where: { discordId }, relations: ["legsGivenTo", "legsReceivedFrom"] });
        if (user == undefined) {
            user = await User_1.create({ discordId }).save();
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
    typeorm_1.ManyToMany(type => User_1, user => user.legsReceivedFrom),
    typeorm_1.JoinTable({
        name: "users_legs",
        joinColumn: {
            name: "from",
            referencedColumnName: "discordId"
        },
        inverseJoinColumn: {
            name: "to",
            referencedColumnName: "discordId"
        }
    }),
    __metadata("design:type", Array)
], User.prototype, "legsGivenTo", void 0);
__decorate([
    typeorm_1.ManyToMany(type => User_1, user => user.legsGivenTo),
    __metadata("design:type", Array)
], User.prototype, "legsReceivedFrom", void 0);
User = User_1 = __decorate([
    typeorm_1.Entity()
], User);
exports.User = User;
//# sourceMappingURL=User.js.map