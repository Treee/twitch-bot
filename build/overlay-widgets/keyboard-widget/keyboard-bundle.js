(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const keyboard_widget_1 = require("./keyboard-widget");
new keyboard_widget_1.KeyboardWidget();

},{"./keyboard-widget":2}],2:[function(require,module,exports){
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

},{}]},{},[1]);
