(() => {

    toggleVisibility = (toggle) => {
        if (toggle === 'show') {
            $('#hide-url-builder').show(1);
            $('.emote-widget-url-builder').show(1);
            $('#show-url-builder').hide(1);
        } else if (toggle === 'hide') {
            $('#hide-url-builder').hide(1);
            $('.emote-widget-url-builder').hide(1);
            $('#show-url-builder').show(1);
        }
    };

    generateUrlParams = () => {
        let url = `${window.location.origin}${window.location.pathname}`;
        const clientId = getTextboxValue('clientId');
        url = url.concat(`?clientId=${clientId}`);
        const channel = getTextboxValue('channel');
        if (channel !== 'itsatreee') {
            url = url.concat(`&channel=${itsatreee}`);
        }
        const showTwitch = getRadioButtonCheckedValue('showTwitch');
        if (showTwitch !== 'true') {
            url = url.concat(`&showTwitch=${showTwitch}`);
        }
        const showGlobal = getRadioButtonCheckedValue('showGlobal');
        if (showGlobal !== 'false') {
            url = url.concat(`&showGlobal=${true}`);
        }
        const showBttv = getRadioButtonCheckedValue('showBttv');
        if (showBttv !== 'false') {
            url = url.concat(`&showBttv=${true}`);
        }

        const totalEmotes = getNumberInputValues('totalEmotes');
        if (totalEmotes !== '100') {
            url = url.concat(`&totalEmotes=${totalEmotes}`);
        }
        const secondsToRain = getNumberInputValues('secondsToRain');
        if (secondsToRain !== '10') {
            url = url.concat(`&secondsToRain=${secondsToRain}`);
        }
        const secondsToWaitForRain = getNumberInputValues('secondsToWaitForRain');
        if (secondsToWaitForRain !== '23') {
            url = url.concat(`&totalEmotes=${secondsToWaitForRain}`);
        }
        const numTimesToRepeat = getNumberInputValues('numTimesToRepeat');
        if (numTimesToRepeat !== '1') {
            url = url.concat(`&numTimesToRepeat=${numTimesToRepeat}`);
        }
        // const single = getTextboxValue('single');
        // if (single !== '') {
        //     url = url.concat(`&single=${single}`);
        // }
        console.log(url);
        $('#generatedUrl').text(url);
    };

    getRadioButtonCheckedValue = (buttonGroupName) => {
        return $(`input[name="${buttonGroupName}"]:checked`).val();
    }

    getTextboxValue = (id) => {
        return $(`#${id}`).val();
    }

    getNumberInputValues = (name) => {
        return $(`input[name="${name}"]`).val();
    };
})();