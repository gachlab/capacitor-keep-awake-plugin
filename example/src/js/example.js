import { CapacitorKeepAwake } from 'capacitor-keep-away-plugin';

window.testEcho = () => {
    const inputValue = document.getElementById("echoInput").value;
    CapacitorKeepAwake.echo({ value: inputValue })
}
