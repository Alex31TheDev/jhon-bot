module.exports = {
    wlonly: false,
    execute(bot, username, args, say) {
        const commands = Object.keys(bot.commands).join(', ');
        say(`Available commands: ${commands}`);
    }
}