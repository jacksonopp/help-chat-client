import Aura from "@primeuix/themes/aura"
import { definePreset } from "@primeuix/themes";
import { primitive } from "./primitive";

export const HcTheme = definePreset(Aura, {
    primitive: primitive
})