import bcrypt from 'bcrypt';


export const encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);
    return encryptedPassword;
}

export const comparePassword = async (password2compare, userPassword) => {
    const isMatching = await bcrypt.compare(password2compare, userPassword);
    return isMatching;
}
