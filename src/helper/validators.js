const validator = require("validator");

const validateSignUp = (data) => {
    const { userName, fullName, password, email } = data;

    // Validate Username
    if (!userName || userName.length < 4 || userName.length > 20) {
        throw new Error("username is Invalid");
    }

    // Validate Full Name
    if (!fullName || fullName.length < 4 || fullName.length > 20) {
        throw new Error("Name is Invalid");
    }

    // Validate Email
    if (!email || !validator.isEmail(email)) {
        throw new Error("Invalid Email");
    }

    // Validate Password Strength
    if (!password || !validator.isStrongPassword(password)) {
        throw new Error(
            "Password must be strong (at least 8 characters, including uppercase, lowercase, number, and symbol"
        );
    }
};

const ValidateLogin = (data) => {
    const { email, password } = data;
    if (!validator.isEmail(email) || !email) {
        throw new Error("Invalid Email");
    }
    if (!password || !validator.isStrongPassword(password)) {
        throw new Error("Invalid Password");
    }
};
const validatePassword = (data) => {
    if (!data || !validator.isStrongPassword(data)) {
        throw new Error("Invalid Password");
    }
}
module.exports = { validateSignUp, ValidateLogin, validatePassword };
