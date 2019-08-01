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
var Image_1;
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
let Image = Image_1 = class Image extends typeorm_1.BaseEntity {
    info(guild) {
        const addedbyMember = this.addedBy.getDiscordMember(guild);
        return `${this.name} (<${this.url}>) added ${this.createdAt.toISOString()} by **${addedbyMember.displayName}** (${addedbyMember.user.username}#${addedbyMember.user.discriminator})`;
    }
    static findImage(name) {
        return Image_1.createQueryBuilder("image")
            .leftJoinAndSelect("image.addedBy", "addedBy")
            .where("LOWER(image.name) = LOWER(:name)", { name })
            .getOne();
    }
    static async nameExist(name) {
        return await Image_1.createQueryBuilder("image")
            .where("LOWER(image.name) = LOWER(:name)", { name })
            .getCount() > 0;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Image.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", String)
], Image.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Image.prototype, "url", void 0);
__decorate([
    typeorm_1.ManyToOne(type => User_1.User, { eager: true }),
    __metadata("design:type", User_1.User)
], Image.prototype, "addedBy", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Image.prototype, "createdAt", void 0);
Image = Image_1 = __decorate([
    typeorm_1.Entity()
], Image);
exports.Image = Image;
//# sourceMappingURL=Image.js.map