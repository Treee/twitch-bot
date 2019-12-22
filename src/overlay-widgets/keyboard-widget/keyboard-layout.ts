export class Key {
    key: string;
    displayText: string;
    isPressed: boolean = false;

    constructor(key: string, displayText: string) {
        this.key = key;
        this.displayText = displayText;
    }
}

const escRow: any = {
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

const backQuoteRow: any = {
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

const tabRow: any = {
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

const capsLockRow: any = {
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

const shiftRow: any = {
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

const spaceRow: any = {
    'ControlLeft': ['Control'],
    'MetaLeft': ['Meta'],
    'AltLeft': ['Alt'],
    'Space': ['Space'],
    'AltRight': ['Alt'],
    'MetaRight': ['Meta'],
    'ContextMenu': ['ContextMenu'],
    'ControlRight': ['Control']
};

export const QwertyKeyboard: any[] = [
    escRow,
    backQuoteRow,
    tabRow,
    capsLockRow,
    shiftRow,
    spaceRow
]