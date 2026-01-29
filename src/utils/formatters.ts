
// slugify ne yapar: metni url uygun hale getirir
export const slugify = (text: string): string => {
    if(!text || typeof text !== "string") {
        return "";
    }

    return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// truncate ne yapar: metni belirli uzunlukta keser
export const truncate = (text: string, maxLength = 100): string => {
    if(!text || typeof text !== "string") {
        return text;
    }

    if(text.length <= maxLength) {
        return text;
    }

    return text.substring(0, maxLength) + "..."
}

// capitalize ne yapar: metni büyük harfle baslatir
export const capitalize = (text: string): string | undefined => {
    if(!text || typeof text !== "string") {
        return "";
    }

    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

// formatDate ne yapar: tarihi belirli bir formatta yazar
export const formatDate = (date: Date): string => {
    if(!date || !(date instanceof Date) || isNaN(date.getTime())) {
        return ""
    }

    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric"};
    const formattedDate = date.toLocaleDateString('en-US', options)
    return formattedDate
}