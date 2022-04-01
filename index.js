const Discord = require('discord.js');
const { prefix, token, YOUTUBE_API } = require('./config.json');
const client = new Discord.Client();
const ytdl = require('ytdl-core');
const search = require('youtube-search');
const opts = {
    maxResults: 25,
    key: YOUTUBE_API,
    type: 'video'
};
const streamOptions = {
    seek: 0,
    voulume: 1
}
const messageStorage = [];
var servers = {};
const queue = new Map();


const sendType = (message) => {
    if (detectImage(message) == true) {
        let image = message.attachments.first().url;
        return image;
    } else {
        return message.content;
    }
}
const detectImage = (message) => {
    if (message.content == '') {
        return true;
    } else {
        return false;
    }
}

function attachIsImage(msgAttach) {
    var url = msgAttach.url;
    //True if this url is a png image.
    return url.indexOf("png", url.length - "png".length /*or 3*/) !== -1;
}

var GphApiClient = require('giphy-js-sdk-core');
giphy = GphApiClient("6zkrRsl3yorxLUF7zxAmPoI2namhHGZV");

var timestampFromSnowflake = (id) => {
    return (id / 4194304) + 1420070400000;
};

client.once('ready', () => {
    console.log('Ready!');
    console.log("history array: " + messageStorage.length);
})

client.on('message', message => {
    // console.log
    let unix_timestamp = message.id;
    if (message.author.bot === false) {
        supriseMsg(message);
        musicMain(message);
        if (checkIfUser(message, "Used Water Bottle#7974") === 1) {
            console.log("done");
        }
        messageStorage.push(
            {
                date: new Date(timestampFromSnowflake(unix_timestamp)).toLocaleString(),
                user: message.member.user.tag,
                msgContent: sendType(message),
                serverID: message.guild.name + " | " + message.guild.id
            }
        );

        if (message.content.toUpperCase().startsWith(`${prefix}RESET`)) {
            resetBot(message.channel);
        }

        if (message.content.toUpperCase().startsWith(`${prefix}HELP`)) {
            let args = message.content.substring(prefix.length).split(" ");
            if (args[1] === "music") {
                console.log("works");
                const exampleEmbed = new Discord.RichEmbed()
                    .setColor('#0099ff')
                    .setTitle("Music commands")
                    .setAuthor("Test Bot", 'https://pbs.twimg.com/profile_images/437272378876624896/jzShpGCg.jpeg', '')
                    .addField('?play <Youtube Link>', 'This command plays a valid Youtube link in your voice channel!', false)
                    .addField('?skip', 'This command skips the current song and plays the next song in queue!', false)
                    .addField('?stop', 'This command clears the queue and the bot leaves the voice channel!', false)
                    .addField('?queue', 'This command shows the queue!', false)
                    .setTimestamp()
                    .setFooter(message.member.user.tag, message.member.user.avatarURL);
                message.channel.send(exampleEmbed);
            }else if(args[1] === "games"){
                console.log("works");
                exampleEmbed = new Discord.RichEmbed()
                    .setColor('#0099ff')
                    .setTitle("Game Commands")
                    .setAuthor("Test Bot", 'https://pbs.twimg.com/profile_images/437272378876624896/jzShpGCg.jpeg', '')
                    .addField('?game spam', 'This command spams a user of your choice!', false)
                    .addField('?game cat', 'This command sends an ascii image of a cat', false)
                    .addField('?game test', 'This command plays an animation of someone doing a cartwheel', false)
                    .setTimestamp()
                    .setFooter(message.member.user.tag, message.member.user.avatarURL);
                message.channel.send(exampleEmbed);
            }else if (message.content.substring(5) === "") {
                console.log("works");
                exampleEmbed = new Discord.RichEmbed()
                    .setColor('#0099ff')
                    .setTitle("General Commands")
                    .setAuthor("Test Bot", 'https://pbs.twimg.com/profile_images/437272378876624896/jzShpGCg.jpeg', '')
                    .addField('?gif <search Here>', 'This command posts a random gif related to your keywords!', false)
                    .addField('?clear <1-100 messages to clear>', 'This command clears between 1 and 100 messages from your channel!', false)
                    .addField('?help music', 'This command shows you a list of available music commands!', false)
                    .addField('?help games', 'This command shows you a list of available game commands!', false)
                    .addField('?history', 'The history command provides a list of all messages in the server(In progress)!', false)
                    .addField('?searchHistory <search using date MM/DD/YYYY><PM/AM><HH>', 'The searchHistory command is under progress.', false)
                    .setTimestamp()
                    .setFooter(message.member.user.tag, message.member.user.avatarURL);
                message.channel.send(exampleEmbed);
            } else {
                console.log("works");
                exampleEmbed = new Discord.RichEmbed()
                    .setThumbnail('http://iconbug.com/data/26/256/a2ccff2488d35d8ebc6189ea693cb4a0.png')
                    .setColor('#0099ff')
                    .setTitle("Help...")
                    .setAuthor("Test Bot", 'https://pbs.twimg.com/profile_images/437272378876624896/jzShpGCg.jpeg', '')
                    .addField('?help', 'The help command gives you a list of general commands and their functions!', false)
                    .addField('?help music', 'The music help extention gives you a list of music commands with descriptions to help you understand the radio function of this bot!', true)
                    .setTimestamp()
                    .setFooter(message.member.user.tag, message.member.user.avatarURL);
                message.channel.send(exampleEmbed);
            }

        }


        if (message.content.toUpperCase().startsWith(`${prefix}HISTORY`)) {
            if (message.content.substring(7) !== "") {
                    messageStorage.forEach(element =>
                        setTimeout(() => {
                            const exampleEmbed = new Discord.RichEmbed()
                                .setThumbnail(element.user.avatarURL)
                                .setColor('#0099ff')
                                .setTitle("Message: ")
                                .setDescription(element.msgContent)
                                .setAuthor("Test Bot", 'https://pbs.twimg.com/profile_images/437272378876624896/jzShpGCg.jpeg', '')
                                .addField('Date: ', element.date, false)
                                .addField('User:', element.user, true)
                                .setTimestamp()
                                .setFooter(message.member.user.tag, message.member.user.avatarURL);
                            message.channel.send(exampleEmbed);
                        }, 1250)
                    );
               
            }
        }
        if (message.content.toUpperCase().startsWith(`${prefix}SEARCH`)) {

            if (message.content.substring(8) === "") {
                searchMethod(message);
                console.log("Command passes")
            } else {
                message.channel.send("Please just enter valid search parameters!")
            }
        }
        if (message.content.toUpperCase().startsWith(`${prefix}GAME`)) {
            console.log(message.content.substring(6));
            if (message.content.toUpperCase().substring(6) === "TEST") {
                let testArr =
                    ["```" + "  o  \n" + " /|\\ \n" + " / \\ \n" + "```",
                    "```" + "\\ o /\n" + "  |  \n" + " / \\ \n" + "```",
                    "```" + "      _ o \n" + "       /\\ \n" + "      | \ \n" + "```",
                    "```" + "                \n" + "           ___\\o\n" + "          /)  | \n" + "```",
                    "```" + "               __|  \n" + "                 \o \n" + "                 ( \\\n" + "```",
                    "```" + "                     \\ / \n" + "                      |  \n" + "                     /o\\ \n" + "```",
                    "```" + "                            |__\n" + "                          o/   \n" + "                         / )   \n" + "```",
                    "```" + "                                   \n" + "                              o/__ \n" + "                              |  (\\\n" + "```",
                    "```" + "                                     o _\n" + "                                     /\\ \n" + "                                     / |\n" + "```",
                    "```" + "                                        \\ o /\n" + "                                          |  \n" + "                                         / \\ \n" + "```",
                    "```" + "                                          o  \n" + "                                         /|\\ \n" + "                                         / \\ \n" + "```",];
                var counter = 0;
                const embed = new Discord.RichEmbed({
                    title: 'Suggestion by someone',
                    description: 'This is a test suggestion. Can you please like it or dislike it :)',
                    fields: [{
                        name: 'Like:',
                        value: '<3'
                    }]
                });
                message.channel.send("This is a test!").then((msg) => {
                    setInterval(function () {
                        if (counter <= testArr.length) {
                            msg.edit(testArr[counter++]);
                        } else {
                            clearInterval();
                        }
                    }, 1250);

                })

            }
            if (message.content.toUpperCase().substring(6) === "SPAM") {
                message.channel.send("Please enter the user you would like to spam: ");
                var collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });
                var user;
                var amount = 0;
                var turnOn = 0;
                // console.log(collector.content)
                collector.on('collect', messageE => {
                    user = messageE.content.substring(3, messageE.content.length - 1)
                    console.log(messageE.content + " Original")
                    console.log(user + " What we want")
                    try {
                        var userTag = client.users.get(user).username + "#" + client.users.get(user).discriminator;
                        console.log(userTag)
                        if (checkIfUser(message, userTag) === 1) {
                            console.log("dave");
                            var counter = 0;
                            const intervalE = setInterval(function () {
                                if (counter <= ((Math.floor(Math.random() * Math.floor(10))) + 15)) {
                                    message.channel.send(messageE.content);
                                    counter++;
                                } else {
                                    clearInterval(intervalE);
                                    message.channel.send(":warning:  " + "Spam machine is turning off.....")
                                    setTimeout(() => {
                                        message.channel.fetchMessages({ limit: 1 }).then(function (list) {
                                            message.channel.bulkDelete(list);
                                        })
                                    }, 5000);
                                }
                            }, 1250);

                        } else {
                            message.channel.send("Please enter a user in this server.");
                            collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });
                        }
                    } catch (ex) {
                        message.channel.send("Please enter a valid user");
                        message.channel.send(":warning:  " + "Spam machine is turning off.....")
                        setTimeout(() => {
                            message.channel.fetchMessages({ limit: 2 }).then(function (list) {
                                message.channel.bulkDelete(list);
                            })
                        }, 5000);
                        console.log(ex);
                    }


                })
            }
            if (message.content.toUpperCase().substring(6) === "CAT") {
                message.channel.send(
                    "```" +
                    "                      (`.-,')\n" +
                    "                    .-'     ;\n" +
                    "                _.-'   , `,-\n" +
                    "          _ _.-'     .'  /._\n" +
                    "        .' `  _.-.  /  ,'._;)\n" +
                    "       (       .  )-| (\n" +
                    "        )`,_ ,'_,'  \\_;)\n" +
                    "('_  _,'.'  (___,))\n" +
                    " `-:;.-'\n" +
                    "```")
            }
        }

        if (message.content.toUpperCase().startsWith(`${prefix}GIF`)) {
            if (message.content.substring(4) !== "") {
                gifSearch(message);
            } else if (message.content.substring(4) === "") {
                message.channel.send("The proper format for this command is: ");
                message.channel.send("\"?searchGif keywords\"");

            }
        }

        if (message.member.hasPermission((['KICK_MEMBERS'], ['BAN_MEMBERS']))) {
            if (message.content.toUpperCase().startsWith(`${prefix}KICK`)) {
                let member = message.mentions.members.first();
                member.kick().then((member) => {
                    message.channel.send(":wave:  " + member.displayName + " got kicked.");
                })
            }
        }
        if (message.member.hasPermission((['READ_MESSAGE_HISTORY']))) {
            clearCode(message);
        }
    }

})
function checkIfUser(message, inputUser) {
    var user = inputUser;
    var trueUser = 0;
    const list = client.guilds.get(message.guild.id);
    list.members.forEach(member => {
        let userTag = member.user.tag;
        if (user === userTag) {
            trueUser = 1;
        }

    });
    return trueUser;
}

function resetBot(channel) {
    // send channel a message that you're resetting bot [optional]
    channel.send('Resetting...')
        .then(msg => client.destroy()).then(() => client.login(token)).then(() => {
            channel.send("Bot has been Reset!");
            console.log("Bot has been reset");
            channel.fetchMessages({ limit: 2 }).then(function (list) {
                channel.bulkDelete(list);
            })
        });
}
function supriseMsg(message) {
    var randomVar = (Math.floor(Math.random() * Math.floor(20)));
    var randomVarThree = (Math.floor(Math.random() * Math.floor(25)));

    if (randomVar === 1) {
        message.channel.send("What you just posted was cool!");
    } else if ((randomVar === 12)) {
        message.channel.send("What you just posted was interesting.");
    } else if (randomVarThree === 5) {
        welcomeInfo(message);
    }
}

function welcomeInfo(message) {
    const arrOfGreeting = [
        "is cool!",
        "is awesome!",
        "is geat!",
    ]
    let randomVar = Math.floor(Math.random() * Math.floor(arrOfGreeting.length));
    console.log(randomVar);
    message.channel.send(message.author + " " + arrOfGreeting[randomVar] + "! \n");
}
function gifSearch(message) {
    let searchMsg = message.content.substring(4);
    giphy.search('gifs', { "q": searchMsg, "limit": 150 })
        .then((response) => {
            var totalResponses = response.data.length;
            var responseIndex = Math.floor((Math.random() * 150) + 1) % totalResponses;
            var responseFinal = response.data[responseIndex];
            message.channel.send("Your search results for" + message.content.substring(10) + " are: ", {
                files: [responseFinal.images.fixed_height.url]
            });
        }).catch((e) => {
            message.channel.send("Error");
            console.log(e);
        })
}

async function searchMethod(message) {
    let embed = new Discord.RichEmbed()
        .setColor(0x0099ff)
        .setDescription("Please enter a search query. Remember to narrow down your search.")
        .setTitle("YouTube Search API");
    let embedMsg = await message.channel.send(embed);
    let filter = m => m.author.id === message.author.id;
    let query = await message.channel.awaitMessages(filter, { max: 1 });
    let results = await search(query.first().content, opts).catch(err => console.log(err));
    if (results) {
        let youtubeResults = results.results;
        let i = 0;
        message.channel.send({
            embed: {
                title: 'Select what sort of search you would like to preform!',
                fields: [
                    {
                        name: 'random',
                        value: 'Returns a video from the top twenty five searches!',
                    },
                    {
                        name: 'top',
                        value: 'Returns a video from the top three searches!',
                    },
                ],
                color: 0x0099ff,
                timestamp: new Date(),
                footer: {
                    text: message.member.user.tag,
                    icon_url: message.member.user.avatarURL,
                },
            }
        }).catch(err => console.log(err));
        filter = m => (m.author.id === message.author.id);
        let collected = await message.channel.awaitMessages(filter, { maxMatches: 1 });
        var selected;
        if (collected.first().content.toUpperCase() === "RANDOM") {
            selected = youtubeResults[Math.floor((Math.random() * youtubeResults.length) + 1) - 1];
            // isOn = 1
        } else if (collected.first().content.toUpperCase() === "TOP") {
            selected = youtubeResults[Math.floor((Math.random() * 3) + 1) - 1];
            // isOn = 1
        } else {
            message.channel.send({
                embed: {
                    title: ':warning:  ' + 'Please enter only random or top: ',
                    color: 0x0099ff,
                    timestamp: new Date(),
                    fields: [
                        {
                            name: 'random',
                            value: 'Returns a video from the top twenty five searches!',
                        },
                        {
                            name: 'top',
                            value: 'Returns a video from the top three searches!',
                        },
                    ],
                    footer: {
                        text: message.member.user.tag,
                        icon_url: message.member.user.avatarURL,
                    },
                }
            }).catch(err => console.log(err));
        }

        embed = new Discord.RichEmbed()
            .setTitle(`${selected.title}`)
            .setURL(`${selected.link}`)
            .setDescription(`${selected.description}`)
            .setThumbnail(`${selected.thumbnails.default.url}`);

        message.channel.send(embed);


        // console.log("Command in function")
        // let embed = new Discord.RichEmbed()
        //     .setColor(0x0099ff)
        //     .setDescription("Please enter a search: ")
        //     .setTitle("Youtube Music Search Tool");
        // let embedMsg = await message.channel.send(embed);
        // let filter = m => m.author.id === message.author.id;
        // let query = await message.channel.awaitMessages(filter, { max: 1 });
        // let results = await search(query.first().content, opts).catch(err => console.log(err));
        // if(results) {
        //     let youtubeResults = results.results;
        //     let i  =0;
        //     message.channel.send({
        //         embed: {
        //             title: 'Select what sort of search you would like to preform!',
        //             fields: [
        //                 {
        //                     name: 'random',
        //                     value: 'Returns a video from the top twenty five searches!',
        //                 },
        //                 {
        //                     name: 'top',
        //                     value: 'Returns a video from the top three searches!',
        //                 },
        //             ],
        //             color: 0x0099ff,
        //             timestamp: new Date(),
        //             footer: {
        //                 text: message.member.user.tag,
        //                 icon_url: message.member.user.avatarURL,
        //             },
        //         }
        //     }).catch(err => console.log(err));
        //     var isOn = 0;
        //     while(isOn === 0){
        //         filter = m => (m.author.id === message.author.id);
        //         let collected = await message.channel.awaitMessages(filter, { maxMatches: 1 });
        //         console.log(collected.first().content);
        //         var selected;
        //         if(collected.first().content.toUpperCase() === "RANDOM"){
        //             selected = youtubeResults[Math.floor((Math.random() * youtubeResults.length) + 1) - 1];
        //             isOn = 1
        //         }else if(collected.first().content.toUpperCase() === "TOP"){
        //             selected = youtubeResults[Math.floor((Math.random() * 3) + 1) - 1];
        //             isOn = 1
        //         }else{
        //             message.channel.send({
        //                 embed: {
        //                     title:':warning:  '+ 'Please enter only random or top: ',
        //                     color: 0x0099ff,
        //                     timestamp: new Date(),
        //                     fields: [
        //                         {
        //                             name: 'random',
        //                             value: 'Returns a video from the top twenty five searches!',
        //                         },
        //                         {
        //                             name: 'top',
        //                             value: 'Returns a video from the top three searches!',
        //                         },
        //                     ],
        //                     footer: {
        //                         text: message.member.user.tag,
        //                         icon_url: message.member.user.avatarURL,
        //                     },
        //                 }
        //             }).catch(err => console.log(err));
        //         }
        //     }



        //     embed = new Discord.RichEmbed()
        //         .setTitle(`${selected.title}`)
        //         .setURL(`${selected.link}`)
        //         .setDescription(`${selected.description}`)
        //         .setThumbnail(`${selected.thumbnails.default.url}`)
        //         .setColor(0x0099ff);
        //     message.channel.send(embed);
        //     console.log(selected)
        //     return(selected.then((e) => {
        //         consol.log(e.link)
        //     }));
        // }
    }
}


async function clearCode(message) {
    if (message.content.startsWith(`${prefix}clear`)) {
        const args = message.content.split(' ').slice(1);
        const amount = args.join(' ');
        console.log(amount)
        if (amount > 100) {
            message.channel.send("Please enter a number between 0 and 100.")
        } else {
            message.channel.fetchMessages({ limit: amount })
                .then(function (list) {
                    if (message.channel.bulkDelete(list)) message.channel.send(amount + " message's were cleared.");
                }, function (err) { message.channel.send("ERROR: ERROR CLEARING CHANNEL.") })
        }
    }
}


function musicMain(message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const serverQueue = queue.get(message.guild.id);

    if (message.content.toUpperCase().startsWith(`${prefix}PLAY`)) {
        const voiceChannel = message.member.voiceChannel;
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (message.member.voiceChannel) {
            if (permissions.has('CONNECT') || permissions.has('SPEAK')) {
                if (validURL(message.content.substring(6))) {
                    execute(message, serverQueue, 0, voiceChannel);
                    console.log("regualr")
                    return;
                } else if (message.content.toUpperCase().substring(6) === "SEARCH") {
                    searchMethod(message)

                    console.log("special search")
                } else {
                    message.channel.send("Please enter a valid Youtube link.")
                }
            } else {
                message.channel.send('I need the permissions to join and speak in your voice channel!');
            }
        } else {
            message.channel.send('You need to be in a voice channel to play music!');
        }
    } else if (message.content.toUpperCase().startsWith(`${prefix}SKIP`)) {
        skip(message, serverQueue);
        return;
    } else if (message.content.toUpperCase().startsWith(`${prefix}STOP`)) {
        stop(message, serverQueue);
        return;
    } else if (message.content.toUpperCase().startsWith(`${prefix}QUEUE`)) {
        queueE(message, serverQueue);
        return;
    }
}
async function execute(message, serverQueue, isSearch, voiceChannelE) {
    var args = "";
    var songInfo = "";
    console.log(message)
    if (isSearch === 0) {
        args = message.content.split(' ');
        songInfo = await ytdl.getInfo(args[1]);
        // console.log(songInfo)
    } else if (isSearch === 1) {
        args = message;
        songInfo = await ytdl.getInfo(args);
        console.log("503" + message)
    }
    const song = {
        title: songInfo.title,
        url: songInfo.video_url,
    };
    console.log(songInfo.video_url + "weee");
    if (!serverQueue) {
        const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannelE,
            connection: null,
            songs: [],
            volume: 5,
            playing: true,
        };

        queue.set(message.guild.id, queueContruct);

        queueContruct.songs.push(song);

        try {
            var connection = await voiceChannelE.join();
            queueContruct.connection = connection;
            play(message.guild, queueContruct.songs[0]);
        } catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
        }
    } else {
        serverQueue.songs.push(song);
        console.log(serverQueue.songs);
        return message.channel.send(`${song.title} has been added to the queue!`);
    }

}

function skip(message, serverQueue) {
    if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
    if (!serverQueue) return message.channel.send('There is no song that I could skip!');
    try {
        message.channel.send(serverQueue.songs[0].title + " has been skipped.")
        serverQueue.connection.dispatcher.end();
    } catch (ex) {
        console.log(ex)
        message.channel.send("There are no songs in the queue.")
    }
}

function stop(message, serverQueue, songs) {
    if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
    try {
        serverQueue.songs = [];
    } catch (ex) {
        console.log(ex)
    }
    try {
        serverQueue.connection.dispatcher.end();
    } catch (ex) {
        console.log(ex)
    }
}

function play(guild, song) {
    const serverQueue = queue.get(guild.id);

    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
        .on('end', () => {
            console.log('Music ended!');
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on('error', error => {
            console.error(error);
        });
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}
function queueE(message, serverQueue) {
    if (!serverQueue) {
        message.channel.send("There are no songs in the queue.");
    } else {
        var counter = 0;
        for (let i = serverQueue.songs.length; i >= 1; i--) {

            console.log("for loop test" + i + serverQueue.songs.length);
            const exampleEmbed = new Discord.RichEmbed()
                .setColor('#0099ff')
                .setURL(serverQueue.songs[counter].url)
                .setDescription(serverQueue.songs[counter].title)
                .setThumbnail(client.user.avatarURL)
                .setTimestamp()
                .setFooter(message.member.user.tag, message.member.user.avatarURL);
            if (i == serverQueue.songs.length) {
                exampleEmbed.setTitle("You are currently listening to: ");
            } else {
                exampleEmbed.setTitle("This song is " + counter + " places from playing.");
            }
            counter++;
            message.channel.send(exampleEmbed);


        }
    }
}
const validURL = (str) => {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}


client.login(token);

// function play(connection, message){
//     var server = servers[message.guild.id];

//     server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));

//     server.queue.shift();

//     server.dispatcher.on("end", function(){
//         if(server.queue[0]){
//             play(connection, message);
//         }else{
//             connection.disconnect();
//         }
//     });
// }

// 

//         if(message.content.startsWith(`${prefix}play`)){
//             // console.log(validURL(message.content.substring(6)));
//             if(!args[1]){ 
//                 console.log(args[0]);
//                 message.channel.send("You need to provide a link!");
//                 return;
//             }else{
//                 if(validURL(message.content.substring(6))){

//                     if(!message.member.voiceChannel){
//                         message.channel.send("You must be in a channel to play the bot!");
//                         return;
//                     }
//                     message.channel.send(":arrow_forward: " + "Playing the Song!")
//                     if(!servers[message.guild.id]) servers[message.guild.id] = {
//                         queue: []
//                     }

//                     var server = servers[message.guild.id];


//                     server.queue.push(args[1]);


//                     console.log(server.queue);
//                     if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection){
//                         play(connection, message);
//                     })
//                 }else{
//                     message.channel.send("Please enter a valid link!")
//                 }
//             }
//         }
//         if(message.content.startsWith(`${prefix}skip`)){
//             var server = servers[message.guild.id];
//             if(message.content.substring(5) === "" ){
//                 console.log(typeof(server.queue[0].msgContent));
//                 if (server.queue.length > 0) {
//                     message.channel.send(":track_next: " + "Skipping the Song!")
//                     if(server.dispatcher){
//                         server.dispatcher.end();
//                     }
//                     server.queue.splice(0, 1);

//                     if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection){
//                         play(connection, message);
//                     })

//                 }else{
//                     message.channel.send("There are no songs to skip.");
//                 }

//             }
//         }
//         if(message.content.startsWith(`${prefix}queue`)){
//             var server = servers[message.guild.id];
//             if(message.content.substring(7) === "" ){ 
//                 if(server.queue.length === 0){
//                     message.channel.send("There are no songs in the queue.");
//                 }else{
//                     for (let i = 0; i < server.queue.length - 1; i++){
//                         message.channel.send(server.queue[i]);
//                         console.log("item " + i + ": " + server.queue[i]);
//                     }
//                 }
//             }
//         }
//         if(message.content.startsWith(`${prefix}stop`)){
//             counter = 0;
//             var server = servers[message.guild.id];
//             if(message.content.substring(5) === "" ){
//                 console.log("stopped the queue")
//                 for (let i = server.queue.length - 1; i >= 0; i--){
//                     server.queue.splice(i, 1);
//                 }
//                 server.dispatcher.end();
//                 message.channel.send(":stop_button: " +" Stopped the Queue and leaving the voice channel");

//                 if(message.guild.connection){
//                     message.guild.voiceConnection.disconnect();
//                 }
//             }
