"use strict";
//email validator ne yapar: email formatını kontrol eder
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUsername = exports.validateLength = exports.isEmpty = exports.validatePassword = exports.validateEmail = void 0;
const validateEmail = (email) => {
    if (!email || typeof email !== "string") {
        return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.validateEmail = validateEmail;
// password validator ne yapar: password formatını kontrol eder
const validatePassword = (password) => {
    if (!password || typeof password !== "string") {
        return false;
    }
    if (password.length < 8) {
        return false;
    }
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return hasUpperCase && hasLowerCase && hasNumber;
};
exports.validatePassword = validatePassword;
// Dizenin bos veya bosluk içerdiğini kontrol eder
const isEmpty = (str) => {
    // Null veya undefined kontrolü
    if (str === null || str === undefined) {
        return true;
    }
    // String olmayan değerler boş kabul edilir
    if (typeof str !== "string") {
        return true;
    }
    // String ise boşluk kontrol et
    return str.trim().length === 0;
};
exports.isEmpty = isEmpty;
// Valitade length ne yapar: dizenin uzunluğunu kontrol eder
const validateLength = (str, min, max) => {
    if (!str || typeof str !== "string") {
        return false;
    }
    const length = str.trim().length;
    return length >= min && length <= max;
};
exports.validateLength = validateLength;
const validateUsername = (username) => {
    return (0, exports.validateLength)(username, 3, 20);
};
exports.validateUsername = validateUsername;
