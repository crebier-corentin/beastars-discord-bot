"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const Image_1 = require("../db/entities/Image");
const User_1 = require("../db/entities/User");
const AsciiTable = require("ascii-table");
exports.ImageAddCommand = {
    name: "image add",
    desc: "Add an image to to the image list",
    usage: "image add [name] [url]",
    example: "image add cool-pic http://site.com/image.png",
    aliases: ["i add"],
    useDefaultPrefix: true,
    adminOnly: true,
    execute: async function (msg, args) {
        //Missing name
        if (args.length == 0) {
            throw new types_1.CommandError(`Missing [name]\n\`${this.usage}\``);
        }
        //Missing url
        if (args.length == 1) {
            throw new types_1.CommandError(`Missing [url]\n\`${this.usage}\``);
        }
        const name = args[0];
        const url = args[1];
        //Forbidden names
        if (["add", "remove", "list"].includes(name.toLowerCase())) {
            throw new types_1.CommandError(`Forbidden image names : \`add\`, \`remove\` or \`list\``);
        }
        //Check if name already exists
        const image = await Image_1.Image.findImage(name);
        if (image != undefined) {
            throw new types_1.CommandError(`Image \`${name}\` already exists :\n${image.info(msg.guild)}`);
        }
        //Add to database
        const newImage = new Image_1.Image();
        newImage.name = name;
        newImage.url = url;
        newImage.addedBy = await User_1.User.findOne({ where: { discordId: msg.member.user.id } });
        await newImage.save();
        await msg.channel.send(`Image \`${name}\` (<${url}>) added to list`);
    }
};
exports.ImageRemoveCommand = {
    name: "image remove",
    desc: "Remove an image to to the image list",
    usage: "image remove [name]",
    example: "image remove cool-pic",
    aliases: ["i remove"],
    useDefaultPrefix: true,
    adminOnly: true,
    execute: async function (msg, args) {
        //Missing name
        if (args.length == 0) {
            throw new types_1.CommandError(`Missing [name]\n\`${this.usage}\``);
        }
        const name = args[0];
        //Check if it exists
        const image = await Image_1.Image.findImage(name);
        if (image == undefined) {
            throw new types_1.CommandError(`Image \`${name}\` does not exist`);
        }
        //Remove from database
        await image.remove();
        await msg.channel.send(`Image \`${name}\` removed`);
    }
};
exports.ImageListCommand = {
    name: "image list",
    desc: "Show the list of images",
    usage: "image list",
    aliases: ["i list"],
    useDefaultPrefix: true,
    adminOnly: false,
    execute: async function (msg) {
        const images = await Image_1.Image.find();
        //Empty
        if (images.length === 0) {
            throw new types_1.CommandError(`There is currently no images in the database.\nAn admin can add images with \`${exports.ImageAddCommand.usage}\``);
        }
        //Table
        const table = new AsciiTable;
        table.setHeading("Name", "Url", "Added by", "Added at");
        //Add rows
        for (const image of images) {
            const addedbyMember = image.addedBy.getDiscordMember(msg.guild);
            table.addRow(image.name, `<${image.url}>`, `${addedbyMember.user.username}#${addedbyMember.user.discriminator}`, image.createdAt.toISOString());
        }
        const result = table.toString();
        //Send multiple messages if one is too long (2000 char max per message)
        for (let i = 0; i < result.length; i += 2000) {
            const toSend = result.substring(i, Math.min(result.length, i + 2000));
            await msg.channel.send("```" + toSend + "```");
        }
    }
};
exports.ImageCommand = {
    name: "image post",
    desc: "Post an image named [name]",
    usage: "image post [name]",
    aliases: ["i post", "image", "i"],
    useDefaultPrefix: true,
    adminOnly: false,
    execute: async function (msg, args) {
        //Missing name
        if (args.length == 0) {
            throw new types_1.CommandError(`Missing [name]\n\`${this.usage}\``);
        }
        const name = args[0];
        //Check if it exists
        const image = await Image_1.Image.findImage(name);
        if (image == undefined) {
            throw new types_1.CommandError(`Image \`${name}\` does not exist`);
        }
        //Send image
        await msg.channel.send({ file: image.url });
    }
};
//# sourceMappingURL=ImageCommands.js.map