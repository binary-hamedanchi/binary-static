const Dropdown = require('@binary-com/binary-style').selectDropdown;

const Contact = (() => {
    const onLoad = () => {
        Dropdown('#cs_telephone_number');
        $('#cs_telephone_number').on('change.cs', function () {
            const val = $(this).val().split(',').map(raw_str => wrapNumberInLink(raw_str));
            $('#display_cs_telephone').html(val[0] + (val.length > 1 ? val[1] : ''));
        });
    };

    const wrapNumberInLink = (raw_str) => {
        const str = raw_str.trim();
        const m = str.match(/ \(Toll Free\)/i);
        const number = m ? str.slice(0, m.index) : str;
        const append = m ? str.slice(m.index) : '';
        return `<a href="tel:${number}">${number}</a>${append}`;
    };

    return {
        onLoad,
    };
})();

module.exports = Contact;
