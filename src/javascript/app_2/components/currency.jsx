import React from 'react';
import { get as getLanguage } from '../../_common/language';

export const addComma = (num, decimal_points, is_crypto) => {
    let number = String(num || 0).replace(/,/g, '');
    if (typeof decimal_points !== 'undefined') {
        number = (+number).toFixed(decimal_points);
    }
    if (is_crypto) {
        number = parseFloat(+number);
    }

    return number.toString().replace(/(^|[^\w.])(\d{4,})/g, ($0, $1, $2) => (
        $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, '$&,')
    ));
};

const Money = ({ sign, currency, money }) => (
    <React.Fragment>
        { sign }
        { currency && <span className={`symbols ${(currency || '').toLowerCase()}`}/> }
        { money }
    </React.Fragment>
);

export const Currency = ({
    currency,
    amount,
    decimals = 0,
    minimumFractionDigits = 0,
    show_indicative,
    percentage,
}) => {
    let money = amount;
    if (money) money = String(money).replace(/,/g, '');
    const sign  = money && Number(money) < 0 ? '-' : '';
    const decimal_places = decimals || '2'; // getDecimalPlaces(currency);

    money = isNaN(money) ? 0 : Math.abs(money);
    if (typeof Intl !== 'undefined') {
        const options = {
            minimumFractionDigits: minimumFractionDigits || decimal_places,
            maximumFractionDigits: decimal_places,
        };
        money = new Intl.NumberFormat(getLanguage().toLowerCase().replace('_', '-'), options).format(money);
    } else {
        money = addComma(money, decimal_places);
    }

    return (
        show_indicative ?
            <span className={money >= 0 ? 'profit' : 'loss'}>
                <Money sign={sign} currency={currency} money={money} />
                { percentage && <span className='percent'> ({percentage > 0 ? '+' : ''}{percentage}%)</span> }
            </span>
            :
            <Money sign={sign} currency={currency} money={money} />
    );
};