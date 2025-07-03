import { Environment } from "@helpchat/types"
import { ENVIRONMENT } from "../injectors/environment.injector"

export function provideEnvironment(environment: Environment) {
    return {
        provide: ENVIRONMENT,
        useValue: environment
    }
}