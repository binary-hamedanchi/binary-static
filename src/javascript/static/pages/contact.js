const Dropdown = require('@binary-com/binary-style').selectDropdown;
const Elevio   = require('../../_common/base/elevio');

const Contact = (() => {
    const onLoad = () => {
        Dropdown('#cs_telephone_number');
        $('#cs_telephone_number').on('change.cs', function () {
            const val = $(this).val().split(',').map(raw_str => wrapNumberInLink(raw_str));
            $('#display_cs_telephone').html(val[0] + (val.length > 1 ? val[1] : ''));
        });

        window._elev.on('ready', embedElevioComponents); // eslint-disable-line no-underscore-dangle
    };

    const embedElevioComponents = () => {
        const component_types = ['menu', 'search', 'suggestions'];
        component_types.forEach((type) => {
            $(`#elevio_element_${type}`).html(Elevio.createComponent(type));
        });
    };

    const wrapNumberInLink = (raw_str) => {
        const str = raw_str.trim();
        const m = str.match(/ \(Toll Free\)/i);
        const number = m ? str.slice(0, m.index) : str;
        const append = m ? str.slice(m.index) : '';
        return `<span><a href="tel:${number}">${number}</a>${append}</span>`;
    };

    return {
        onLoad,
    };
})();

module.exports = Contact;
