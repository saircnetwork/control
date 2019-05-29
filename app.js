var config = require('./config.js');
var IRC = require('irc-framework');
var child = require('child_process');

var bot = new IRC.Client();
bot.connect({
    host: config.irc.host,
    port: 6667,
    nick: config.irc.nick,
    username: config.irc.username
});

bot.on('registered', function() {
    console.log('Connected!');

    bot.join(config.irc.channel);
});

bot.on('join', function(event) {
    if(event.nick == config.irc.nick) {
        console.log('Joined ' + event.channel);
    }

    // Check if host is sa-irc.com and op the user if it does
    if(event.hostname.endsWith(".sa-irc.com")) {
        bot.raw('MODE', event.channel, '+o', event.nick);
    }
});

bot.on('privmsg', function(event) {
    console.log(event);

    if(event.target == config.irc.channel) {
        var data = event.message.split(' ');

        if(data[0] == '&uptime') {
            child.exec('uptime', function(error, stdout, stderror) {
                if(error !== null) {
                    event.reply('Error: ' + error);
                    return;
                }

                event.reply(stdout);
            });
        } else if(data[0] == '&update') {
            child.exec('cd ~/control && git pull && systemctl --user restart control', function(error, stdout, stderror) {
                if(error !== null) {
                    event.reply('Error: ' + error);
                    return;
                }
            });
        }
    }
});

// Uncomment to enable debugging
/*bot.on('raw', function(event) {
    console.log(event);
});*/