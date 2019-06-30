
var rtoCodes = null;
var video = document.querySelector("#videoPlayer");

//load states in select field
const handleStateCode = function (state) {
    const stateCodes = rtoCodes[state].no;
    var codes = Object.keys(stateCodes).map((code) => {
        return { code, name: stateCodes[code] }
    })
    $('#a-code')
        .find('option')
        .remove()
        .end()
        .append(`<option >${state}- State codes</option>`)
        .val('whatever');
    codes = codes.sort();
    codes.map((code) => {
        $('#a-code').append(`<option value=${code.code}>${code.code}-${code.name}</option>`)
    })
}



//add veichle type
function loadVTypes() {
    var vTypes = ['Car', 'Bike/Scooter', 'Auto', 'Bus', 'Truck', 'Van', 'Other']
    vTypes.map((vtype) => {
        $('#v-type').append(`<option value=${vtype}> ${vtype} </option>`)
    })
}

//load rto codes
function loadRtoCodes(data) {
    // console.log(data);
    var states = Object.keys(data).map((s) => {
        return { code: s, name: data[s].name };
    })
    //MH-Maharashtra
    Object.keys(states).map((state) => {
        $('#v-state').append(`<option value=${states[state].code}>${states[state].code}-${states[state].name}</option>`)
    })
    // return;
}

window.addEventListener('load', async function () {

    const loadRtoData = async function () {
        rtoCodes = await $.getJSON('./../../data/rto.json');
        return rtoCodes;
    }

    rtoCodes = await loadRtoData();
    loadVTypes();
    loadRtoCodes(rtoCodes);
})

// 


