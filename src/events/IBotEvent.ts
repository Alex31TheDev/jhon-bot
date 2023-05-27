import BotClient from "../BotClient";

export default interface IBotEvent {
    name: string;
    once?: boolean;
    handler(client: BotClient, ...data: unknown[]): void;
}