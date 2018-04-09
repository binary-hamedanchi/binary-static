import React from 'react';
import moment from 'moment';
import { localize } from '../../_common/localize';

const epochToDateTime = epoch => (`${moment.utc(epoch * 1000).format('YYYY-MM-DD HH:mm:ss')} GMT`);

const getDateTime = (time) => moment(time || undefined).utc().format('YYYY-MM-DD HH:mm:ss [GMT]');

const getRemainingTime = ({ t_start, t_end, t_stopped }) => {
    const now = Math.max(Math.floor((window.time || 0) / 1000), t_start || 0);

    let time_left;
    if ((now >= t_end) || t_stopped) {
        time_left = '-';
    } else {
        let remained = t_end - now;
        let days = 0;
        const day_seconds = 24 * 60 * 60;
        if (remained > day_seconds) {
            days = Math.floor(remained / day_seconds);
            remained %= day_seconds;
        }
        time_left = (days > 0 ? `${days} ${localize(days > 1 ? 'days' : 'day')}, ` : '') + moment((remained) * 1000).utc().format('HH:mm:ss');
    }

    return time_left;
};

export const Time = ({
    epoch,
    time,
    timer,
}) => (
    <React.Fragment>
        { time  && getDateTime(time) }
        { epoch && epochToDateTime(epoch) }
        { timer && getRemainingTime(timer) }
    </React.Fragment>
);
