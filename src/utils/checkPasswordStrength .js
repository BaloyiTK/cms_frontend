const checkPasswordStrength = (password) => {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password);

    // Function to check for repeated digit sequences
    const hasRepeatedDigitSequence = (str) => {
        const digitSequences = /(\d)\1{2,}/g;
        return digitSequences.test(str);
    };

    let score = 0;
    let message = ""; // Initialize as an empty string
    let color = ""; // Initialize color as an empty string

    if (password.length >= minLength &&
        hasUppercase &&
        hasLowercase &&
        hasSpecialChar &&
        !hasRepeatedDigitSequence(password)) {
        score = 5; // Very Strong
        message = "Very Strong";
        color = "green"; // Very Strong: Green
    } else if (password.length >= minLength &&
        hasUppercase &&
        hasLowercase &&
        hasSpecialChar) {
        score = 4; // Strong
        message = "Strong";
        color = "blue"; // Strong: Blue
    } else if (password.length >= minLength &&
        (hasUppercase || hasLowercase) &&
        hasSpecialChar) {
        score = 3; // Medium
        message = "Medium";
        color = "orange"; // Medium: Orange
    } else if (password.length >= minLength) {
        score = 2; // Weak
        message = "Weak";
        color = "red"; // Weak: Red
    } else {
        message = "Very Weak";
        color = "red"; // Very Weak: Red
    }

    return {
        score,
        message,
        color,
    };
};

export default checkPasswordStrength;
