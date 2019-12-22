(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const keyboard_widget_1 = require("./keyboard-widget");
new keyboard_widget_1.KeyboardWidget();

},{"./keyboard-widget":3}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Key {
    constructor(key, displayText) {
        this.isPressed = false;
        this.key = key;
        this.displayText = displayText;
    }
}
exports.Key = Key;
const escRow = {
    'Escape': ['Escape'],
    'F1': ['F1'],
    'F2': ['F2'],
    'F3': ['F3'],
    'F4': ['F4'],
    'F5': ['F5'],
    'F6': ['F6'],
    'F7': ['F7'],
    'F8': ['F8'],
    'F9': ['F9'],
    'F10': ['F10'],
    'F11': ['F11'],
    'F12': ['F12']
};
const backQuoteRow = {
    'Backquote': ['~', '`'],
    'Digit1': ['!', '1'],
    'Digit2': ['@', '2'],
    'Digit3': ['#', '3'],
    'Digit4': ['$', '4'],
    'Digit5': ['%', '5'],
    'Digit6': ['^', '6'],
    'Digit7': ['&', '7'],
    'Digit8': ['*', '8'],
    'Digit9': ['(', '9'],
    'Digit0': [')', '0'],
    'Minus': ['_', '-'],
    'Equal': ['+', '='],
    'Backspace': ['Backspace']
};
const tabRow = {
    'Tab': ['Tab'],
    'KeyQ': ['Q'],
    'KeyW': ['W'],
    'KeyE': ['E'],
    'KeyR': ['R'],
    'KeyT': ['T'],
    'KeyY': ['Y'],
    'KeyU': ['U'],
    'KeyI': ['I'],
    'KeyO': ['O'],
    'KeyP': ['P'],
    'BracketLeft': ['{', '['],
    'BracketRight': ['}', ']'],
    'Backslash': ['|', '\\'],
};
const capsLockRow = {
    'CapsLock': ['CapsLock'],
    'KeyA': ['A'],
    'KeyS': ['S'],
    'KeyD': ['D'],
    'KeyF': ['F'],
    'KeyG': ['G'],
    'KeyH': ['H'],
    'KeyJ': ['J'],
    'KeyK': ['K'],
    'KeyL': ['L'],
    'Semicolon': [':', ';'],
    'Quote': ['"', '\''],
    'Enter': ['Enter']
};
const shiftRow = {
    'ShiftLeft': ['Shift'],
    'KeyZ': ['Z'],
    'KeyX': ['X'],
    'KeyC': ['C'],
    'KeyV': ['V'],
    'KeyB': ['B'],
    'KeyN': ['N'],
    'KeyM': ['M'],
    'Comma': ['<', ','],
    'Period': ['>', '.'],
    'Slash': ['?', '/'],
    'ShiftRight': ['Shift']
};
const spaceRow = {
    'ControlLeft': ['Control'],
    'MetaLeft': ['Meta'],
    'AltLeft': ['Alt'],
    'Space': ['Space'],
    'AltRight': ['Alt'],
    'MetaRight': ['Meta'],
    'ContextMenu': ['ContextMenu'],
    'ControlRight': ['Control']
};
exports.QwertyKeyboard = [
    escRow,
    backQuoteRow,
    tabRow,
    capsLockRow,
    shiftRow,
    spaceRow
];

},{}],3:[function(require,module,exports){
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

},{"./keyboard-layout":2}]},{},[1]);
