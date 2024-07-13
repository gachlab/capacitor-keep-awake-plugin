import { KeepAwake } from '@gachlab/capacitor-keep-awake-plugin';

window.testAllowSleep = () => {
    KeepAwake.allowSleep()
}
window.testDontAllowSleep = () => {
    KeepAwake.dontAllowSleep()
}
