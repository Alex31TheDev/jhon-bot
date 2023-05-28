export default class Util {
    static delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static splitArgs(str: string) {
        const ind = str.indexOf(" ");
        let name, args;

        if(ind === -1) {
            name = str;
            args = "";
        } else {
            name = str.slice(0, ind),
            args = str.slice(ind + 1);
        }

        return [name.toLowerCase(), args];
    }
}