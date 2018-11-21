import moment from 'moment';

function readings(month) {
    console.log(month);
    const momentMonth = moment(month, 'YYYY-MM').startOf('month');
    const dailyReadings = [];
    console.log(momentMonth.daysInMonth());
    let usage = 0;
    for (let i = momentMonth.daysInMonth(); i > 0; i -= 1) {
        const dayUsage = Math.random() + 2;
        dailyReadings.push({
            date: moment(`${month}-${i}`, 'YYYY-MM-DD').format('YYYY-MM-DD'),
            usage: dayUsage,
        });
        usage += dayUsage;
    }
    return { dailyReadings, usage };
}

module.exports = {
    readings,
};
