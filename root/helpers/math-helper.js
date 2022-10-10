"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomNumberBetween = void 0;
function randomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
exports.randomNumberBetween = randomNumberBetween;
