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
