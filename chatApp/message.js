const generateMessage = (from, text) => {
    const createdAt = new Date();
    return {
        from,
        text: `<li>${from}: ${text}</li>`,
        createdAt,
    };
};

const generateLocationMessage = (from, lat, lon) => {
    const createdAt = new Date();
    return {
        from,
        text: `
            <li>
                ${from}
                <a
                    href='https://maps.google.com/?q=${lat},${lon}'
                    target='_blank'
                >
                    location
                </a>
            </li>
        `,
        createdAt,
    };
};

module.exports = {
    generateMessage,
    generateLocationMessage,
};
