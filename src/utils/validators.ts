//email validator ne yapar: email formatını kontrol eder

export const validateEmail = (email: any): boolean => {
    if(!email || typeof email !== "string") {
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// password validator ne yapar: password formatını kontrol eder
export const validatePassword = (password: any): boolean => {
    if(!password || typeof password !== "string") {
        return false
    }

    if(password.length < 8) {
        return false;
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    return hasUpperCase && hasLowerCase && hasNumber;
}

// Dizenin bos veya bosluk içerdiğini kontrol eder
export const isEmpty = (str: any): boolean => {
    // Null veya undefined kontrolü
    if(str === null || str === undefined) {
        return true  
    }

    // String olmayan değerler boş kabul edilir
    if(typeof str !== "string") {
        return true  
    }

    // String ise boşluk kontrol et
    return str.trim().length === 0;
}

// Valitade length ne yapar: dizenin uzunluğunu kontrol eder
export const validateLength = (str: any, min: number, max: number): boolean =>{
    if(!str || typeof str !== "string") {
        return false
    }

    const length = str.trim().length;
    return length >= min && length <= max;
}

export const validateUsername = (username: string): boolean => {
    return validateLength(username, 3, 20);
}