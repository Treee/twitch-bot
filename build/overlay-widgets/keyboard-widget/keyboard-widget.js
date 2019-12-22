"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class KeyboardWidget {
    constructor() {
        this.activeKeys = {};
        this.toggle = true;
        const htmlElement = document.getElementById('keyboard-container');
        if (htmlElement) {
            htmlElement.addEventListener('click', this.onUserClick.bind(this));
            htmlElement.addEventListener('keydown', this.onUserKeyPress.bind(this));
            htmlElement.addEventListener('keyup', this.onUserKeyPress.bind(this));
        }
    }
    onUserClick(event) {
    }
    onUserKeyPress(event) {
        this.activeKeys[event.key] = (event.type === 'keydown');
        console.log('clicked', this.activeKeys);
        this.handleUserInput();
    }
    handleUserInput() {
        const activeKeys = Object.keys(this.activeKeys).filter((key) => {
            var _a, _b;
            const isPressed = this.activeKeys[key];
            if (isPressed) {
                (_a = document.getElementById(key)) === null || _a === void 0 ? void 0 : _a.classList.add('active-key');
            }
            else {
                (_b = document.getElementById(key)) === null || _b === void 0 ? void 0 : _b.classList.remove('active-key');
            }
        });
        return activeKeys.length > 0;
    }
}
exports.KeyboardWidget = KeyboardWidget;
