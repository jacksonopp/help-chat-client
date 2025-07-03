import { ApplicationConfig } from "@angular/core";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from "primeng/config";
import { HcTheme } from "../theme";


export function provideTheme(): ApplicationConfig['providers'] {
    return [
        provideAnimationsAsync(),
        providePrimeNG({
            theme: {
                preset: HcTheme,
                options: {
                    name: 'primeng',
                    order: 'theme, base, primeng'
                }
            }
        })
    ]
}