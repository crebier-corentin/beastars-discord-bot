import {Command, CommandError} from "../types";
import {Image} from "../db/entities/Image";
import {User} from "../db/entities/User";

export const ImageAddCommand: Command = {
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
            throw new CommandError(`Missing [name]\n\`${this.usage}\``);
        }

        //Missing url
        if (args.length == 1) {
            throw new CommandError(`Missing [url]\n\`${this.usage}\``);
        }

        const name = args[0];
        const url = args[1];

        //Check if name already exists
        const image = await Image.findImage(name);

        if (image != undefined) {
            throw new CommandError(`Image ${name} already exists :\n${image.info(msg.guild)}`);
        }

        //Add to database
        const newImage = new Image();
        newImage.name = name;
        newImage.url = url;
        newImage.addedBy = await User.findOne({where: {discordId: msg.member.user.id}});

        await newImage.save();

        await msg.channel.send(`Image ${name} (<${url}>) added to list`);

    }
};