import moment from 'moment';

const format = 'ddd / MMM HH:mm:ss';

const generateMessage = (from, text) => {
    const createdAt = new Date();
    return {
        from,
        text,
        createdAt,
    };
};

const generateLocationMessage = (from, lat, lon) => {
    const createdAt = new Date();
    return {
        from,
        text: `
            <a
                href='https://maps.google.com/?q=${lat},${lon}' target='_blank'
            >
                location
            </a>
        `,
        createdAt,
    };
};

module.exports = {
    format,
    generateMessage,
    generateLocationMessage,
};
