import { QwertyKeyboard } from './keyboard-layout';

export class KeyboardWidget {

    activeKeys: any = {};

    toggle: boolean = true;

    constructor() {
        const htmlElement = document.getElementById('keyboard-container');
        if (htmlElement) {
            htmlElement.addEventListener('click', this.onUserClick.bind(this));
            htmlElement.addEventListener('keydown', this.onUserKeyPress.bind(this));
            htmlElement.addEventListener('keyup', this.onUserKeyPress.bind(this));

            QwertyKeyboard.forEach((row) => {
                this.createRow('keyboard', row);
            })


            setInterval(() => {
                this.handleInput(this.getActivelyPressedKeys());
            }, 1000 / 60);
        }
    }

    onUserClick(event: any) {

    }

    onUserKeyPress(event: any) {
        const key = `${event.code.toLowerCase()}-${event.key.toLowerCase()}`;
        const id = this.transformKeyIntoId(key);
        this.activeKeys[id] = event.type; // keydown, keyup
        event.preventDefault();
    }

    handleInput(keys: string[]) {
        keys.forEach((key) => {
            const id = this.transformKeyIntoId(key);
            document.getElementById(id)?.classList.add('active-key');
        });
    }

    getActivelyPressedKeys(): string[] {
        const activeKeys = Object.keys(this.activeKeys).filter((key) => {
            const id = this.transformKeyIntoId(key);
            if (this.activeKeys[id] === 'keydown') {
                return true;
            } else {
                document.getElementById(id)?.classList.remove('active-key');
            }
        });
        return activeKeys;
    }

    transformKeyIntoId(key: string) {
        let id = `${key.toLowerCase()}`.trim();
        if (id === 'space-') {
            id = 'space-space';
        }
        return id;
    }

    createKeyboardKey(key: string, symbols: string[]): HTMLElement {
        const keyParent = document.createElement('div');
        keyParent.id = key;
        keyParent.classList.add('normal-key');

        keyParent.appendChild(this.createKeySymbol(key, symbols[0]));

        if (symbols.length > 1) {
            keyParent.appendChild(this.createKeySymbol(key, symbols[1]));
        }
        return keyParent;
    }

    createKeySymbol(key: string, symbol: string): HTMLElement {
        const newKey = document.createElement('div');
        newKey.id = `${key}-${symbol.toLowerCase()}`;
        newKey.classList.add('key-symbol');
        newKey.innerText = symbol;
        return newKey;
    }

    createRow(containerIdToAppend: string, rowDataObject: any): void {
        Object.keys(rowDataObject).forEach((key) => {
            document.getElementById(containerIdToAppend)?.appendChild(this.createKeyboardKey(key.toLowerCase(), rowDataObject[key]));
        });
        this.addNewLine(containerIdToAppend);
    }

    private addNewLine(containerIdToAppend: string): void {
        document.getElementById(containerIdToAppend)?.appendChild(document.createElement('br'));
    }

    // c++ keyboard listener without interrupting flow
    // https://stackoverflow.com/questions/7798242/keyboard-mouse-input-in-c

    // compile c++ to js package
    // https://nodejs.org/api/addons.html#addons_addon_examples
}