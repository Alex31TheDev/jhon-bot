/* eslint-disable @typescript-eslint/no-unused-vars */
import BotClient from "../../BotClient";
import BaseCommand from "../BaseCommand";

//trb sa astfel:
//1. schimbi de la class v
export default class TEMPLATE extends BaseCommand {
    //2. schimbi name v
    public name = "TEMPLATE";

    //3. args e futut automat nu mai trb sa mai bagi tu slice sau alte chestii
    //iti da numa ce trb
    public handler(client: BotClient, args: string, username: string) {
        //4. say e cu this v
        this.say("mialugini");
    }
}

//5. trb adaugat la index
//adaugi cv de genu
//import TEMPLATE from "./TEMPLATE";
//export default [..., TEMPLATE, ...];

//6. daca vr sa o dezactivezi pui
//public disabled = false;
//7. are si aliasuri daca vr sa pui faci
//public aliases = ["sugi", "pla"];

//8. te uiti in Loaded x commands. x successful, x failed. sa vezi daca a aparut
//9. daca nu a aparut sugi pl