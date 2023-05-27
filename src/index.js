console.log = function(){}

function print(msg) {
    process.stdout.write(msg+"\n");
}

function parseMessage(msg) {
    const match = msg.match(msgExp);
    
    return {
        user: match[1],
        content: match[2]
    };
}

function say(message) {
    bot.chat(`${message} [` + Math.floor(Math.random() * 99999) + 1 + "]")
}

const mineflayer = require("mineflayer")
const fs = require("fs")
const config = require("./config.json")
const whitelisted = require("./whitelisted.json")

const msgExp = /.+\s(\w+)\s?[›:].(.+)/

const bot = mineflayer.createBot({
    host: config.server_ip,
    port: config.server_port,
    username: config.username,
    version: '1.12.2'
})

bot.commands = {}
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const commandModule = require(`./commands/${file}`);
    const commandName = file.slice(0, -3);
    bot.commands[commandName] = commandModule;
}

bot.on("messagestr", (message) => {
    print(message)
    
    if(message.includes("❤") || message.includes("PLOT CHAT")) { // creative
        const obj = parseMessage(message)
        if(obj.user == config.username) return;

        if(obj.content[0] == config.prefix) {
            const command = obj.content.split(" ")[0].substring(1)
            const args = obj.content.split(" ")

            if(bot.commands[command]) {
                if(bot.commands.wlonly == true) {
                    if(whitelisted.whitelisted.includes(obj.user)) {
                        bot.commands[command].execute(bot,obj.user,args,say,print)
                    } else {
                        say("That command is only for whitelisted people!")
                    }
                } else {
                    bot.commands[command].execute(bot,obj.user,args,say,print)
                }
            } else {
                say(`"${command}" Does not exist. (!help)`)
            }
        }
    }
    
    if(message.includes('/register')) {
        bot.chat(`/register ${config.password_register_login} ${config.password_register_login}`)
        print(`[AUTO_LOGIN_REGISTER] Ran command /register ${config.password_register_login} ${config.password_register_login}`)
    }
    if(message.includes('/login')) {

        setTimeout(() => {
            bot.chat(`/login ${config.password_register_login}`)
            print(`[AUTO_LOGIN_REGISTER] Ran command /login ${config.password_register_login}`) 
        }, 2000);
    }
	if(message.includes("Do not share your Gamster login details with anyone.")) {
		bot.setQuickBarSlot(0);
        bot.activateItem();

        bot.once("windowOpen", (window) => {
                if (window.title.includes("Games")) {
                    print("Opened Compass.");
                    bot.clickWindow(18,0,0)
                    on_creative = true;
                    print("Joined Creative.")
                }
        });
	}
    if(message.includes('/tpdeny')) {
        if(config.settings.toggletpa == true) {
            bot.chat("/tpaccept")
        }
    }
})

bot.on("end", (reason) => {
    print("Ended Session.")
})

bot.on("kicked", (reason) => {
    print("\n\n!! KICKED !!\n" + JSON.parse(reason).text)
})