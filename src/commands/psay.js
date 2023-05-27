module.exports = {
    wlonly: true,
    execute(bot, username, args, say) {
        if(args.length < 2) return say(`[SYNTAX] psay [string]`)
        msg = args.slice(1).join(" ");
        say(msg)
    }
}