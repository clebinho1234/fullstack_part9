export const areNotNumbers = (args: string[]): boolean => {
    for (let index = 0; index < args.length; index++) {
        if(isNaN(Number(args[index])))
            return true;
    }
    return false;
};