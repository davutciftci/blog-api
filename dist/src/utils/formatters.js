"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = exports.capitalize = exports.truncate = exports.slugify = void 0;
// slugify ne yapar: metni url uygun hale getirir
const slugify = (text) => {
    if (!text || typeof text !== "string") {
        return "";
    }
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
};
exports.slugify = slugify;
// truncate ne yapar: metni belirli uzunlukta keser
const truncate = (text, maxLength = 100) => {
    if (!text || typeof text !== "string") {
        return text;
    }
    if (text.length <= maxLength) {
        return text;
    }
    return text.substring(0, maxLength) + "...";
};
exports.truncate = truncate;
// capitalize ne yapar: metni büyük harfle baslatir
const capitalize = (text) => {
    if (!text || typeof text !== "string") {
        return "";
    }
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};
exports.capitalize = capitalize;
// formatDate ne yapar: tarihi belirli bir formatta yazar
const formatDate = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
        return "";
    }
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = date.toLocaleDateString('en-US', options);
    return formattedDate;
};
exports.formatDate = formatDate;
