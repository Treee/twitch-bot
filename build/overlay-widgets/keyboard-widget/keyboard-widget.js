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
        var _a, _b;
        // {}
        // object { event.key: value }
        this.activeKeys[event.key] = (event.type === 'keydown');
        console.log('clicked', this.activeKeys);
        this.toggle = !this.toggle;
        if (!this.toggle) {
            (_a = document.getElementById('test')) === null || _a === void 0 ? void 0 : _a.classList.remove('active-key');
        }
        else {
            (_b = document.getElementById('test')) === null || _b === void 0 ? void 0 : _b.classList.add('active-key');
        }
    }
}
exports.KeyboardWidget = KeyboardWidget;
