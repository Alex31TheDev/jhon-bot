import BotClient from "../BotClient";

export default interface IManager {
    init(): void | Promise<void>;
}