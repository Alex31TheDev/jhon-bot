export default interface IHandler {
    init?(): void | Promise<void>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onEvent(...args: any): void;
}