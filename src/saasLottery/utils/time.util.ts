import dayjs from 'dayjs';
const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
export function parseTime(time: number) {
    const days = Math.floor(time / DAY);
    const hours = Math.floor((time % DAY) / HOUR);
    const minutes = Math.floor((time % HOUR) / MINUTE);
    const seconds = Math.floor((time % MINUTE) / SECOND);
    const milliseconds = Math.floor(time % SECOND);

    return {
        total: time,
        days,
        hours,
        minutes,
        seconds,
        milliseconds,
    };
}

export function fromTime(time: Date | string | number, format = 'YYYY-MM-DD HH:mm:ss') {
    if (!time) return '';
    const formatTime = dayjs(time).format(format);
    if (formatTime === 'Invalid Date') {
        return time;
    }
    return formatTime;
}