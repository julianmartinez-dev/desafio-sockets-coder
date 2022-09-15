const generateID = () => {
    return Math.random().toString(36).substring(2, 9);
}

module.exports = {generateID};