var IRC = require('irc-framework');

var bot = new IRC.Client();
bot.connect({
    host: 'irc.sa-irc.com',
    port: 6667,
    nick: 'Bot-NL-1'
});

bot.on('registered', function() {
    var channel = bot.channel('#vps-control');

    channel.join();
    channel.say('Kirollos is a noob');
});