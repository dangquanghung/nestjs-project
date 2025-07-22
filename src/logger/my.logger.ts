import { LoggerService, LogLevel } from "@nestjs/common";

export class MyLogger implements LoggerService{
    log(message: string, context: string) {
        console.log(`******INFO******[${context}]`, message)
    }
    error(message: any, context: string) {
        console.log(`******INFO******[${context}]`, message)
    }
    warn(message: any, context: string) {
        console.log(`******INFO******[${context}]`, message)
    }
    debug?(message: any, context: string) {
        console.log(`******INFO******[${context}]`, message)
    }
    verbose?(message: any, context: string) {
        console.log(`******INFO******[${context}]`, message)
    }
    fatal?(message: any, context: string) {
        console.log(`******INFO******[${context}]`, message)
    }
    setLogLevels?(levels: LogLevel[]) {
        // sconsole.log(`******INFO******[${context}]`, message)
    }

}