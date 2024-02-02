const isValidMail = (mail) => {
    const re = /^[a-zA-Z0-9._%+-]+@walchandsangli\.ac\.in$/;
    return re.test(mail);
};


module.exports = isValidMail;