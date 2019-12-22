"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const keyboard_layout_1 = require("./keyboard-layout");
class KeyboardWidget {
    constructor() {
        this.activeKeys = {};
        this.toggle = true;
        const htmlElement = document.getElementById('keyboard-container');
        if (htmlElement) {
            htmlElement.addEventListener('click', this.onUserClick.bind(this));
            htmlElement.addEventListener('keydown', this.onUserKeyPress.bind(this));
            htmlElement.addEventListener('keyup', this.onUserKeyPress.bind(this));
            keyboard_layout_1.QwertyKeyboard.forEach((row) => {
                this.createRow('keyboard', row);
            });
            setInterval(() => {
                this.handleInput(this.getActivelyPressedKeys());
            }, 1000 / 60);
        }
    }
    onUserClick(event) {
    }
    onUserKeyPress(event) {
        const key = `${event.code.toLowerCase()}-${event.key.toLowerCase()}`;
        const id = this.transformKeyIntoId(key);
        this.activeKeys[id] = event.type; // keydown, keyup
        event.preventDefault();
    }
    handleInput(keys) {
        keys.forEach((key) => {
            var _a;
            const id = this.transformKeyIntoId(key);
            (_a = document.getElementById(id)) === null || _a === void 0 ? void 0 : _a.classList.add('active-key');
        });
    }
    getActivelyPressedKeys() {
        const activeKeys = Object.keys(this.activeKeys).filter((key) => {
            var _a;
            const id = this.transformKeyIntoId(key);
            if (this.activeKeys[id] === 'keydown') {
                return true;
            }
            else {
                (_a = document.getElementById(id)) === null || _a === void 0 ? void 0 : _a.classList.remove('active-key');
            }
        });
        return activeKeys;
    }
    transformKeyIntoId(key) {
        let id = `${key.toLowerCase()}`.trim();
        if (id === 'space-') {
            id = 'space-space';
        }
        return id;
    }
    createKeyboardKey(key, symbols) {
        const keyParent = document.createElement('div');
        keyParent.id = key;
        keyParent.classList.add('normal-key');
        keyParent.appendChild(this.createKeySymbol(key, symbols[0]));
        if (symbols.length > 1) {
            keyParent.appendChild(this.createKeySymbol(key, symbols[1]));
        }
        return keyParent;
    }
    createKeySymbol(key, symbol) {
        const newKey = document.createElement('div');
        newKey.id = `${key}-${symbol.toLowerCase()}`;
        newKey.classList.add('key-symbol');
        newKey.innerText = symbol;
        return newKey;
    }
    createRow(containerIdToAppend, rowDataObject) {
        Object.keys(rowDataObject).forEach((key) => {
            var _a;
            (_a = document.getElementById(containerIdToAppend)) === null || _a === void 0 ? void 0 : _a.appendChild(this.createKeyboardKey(key.toLowerCase(), rowDataObject[key]));
        });
        this.addNewLine(containerIdToAppend);
    }
    addNewLine(containerIdToAppend) {
        var _a;
        (_a = document.getElementById(containerIdToAppend)) === null || _a === void 0 ? void 0 : _a.appendChild(document.createElement('br'));
    }
}
exports.KeyboardWidget = KeyboardWidget;
