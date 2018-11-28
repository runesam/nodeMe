const generateMessage = (from, text) => {
    const createdAt = new Date().getTime();
    return {
        from,
        text,
        createdAt,
    };
};

module.exports = {
    generateMessage,
};
