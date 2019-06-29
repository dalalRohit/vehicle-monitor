const VP = document.getElementById('videoPlayer') // player
const VPToggle = document.getElementById('vpbtn');
var rtoCodes = null;
var video = document.querySelector("#videoPlayer");
const handleStateCode = function (state) {
    // console.log(rtoCodes);
    const stateCodes = rtoCodes[state].no;
    var codes = Object.keys(stateCodes).map((code) => {
        return { code, name: stateCodes[code] }
    })
    $('#a-code')
        .find('option')
        .remove()
        .end()
        .append(`<option value=State codes>${state}- State codes</option>`)
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
const handleButton = function () {
    // if (VP.paused) {
    //     VP.play();
    // }
    // else {
    //     VP.pause();

    //     // snap();

    // }
    // var video = document.querySelector('video');
    // var canvas = document.querySelector('canvas');
    // var context = canvas.getContext('2d');
    // var w, h, ratio;

    // video.addEventListener('loadedmetadata', function () {
    //     ratio = video.videoWidth / video.videoHeight;
    //     w = video.videoWidth - 100;
    //     h = parseInt(w / ratio, 10);
    //     canvas.width = w;
    //     canvas.height = h;
    // }, false);
    // function snap() {

    //     context.fillRect(0, 0, w, h);
    //     context.drawImage(video, 0, 0, w, h);
    //     canvas.toBlob(function (blob) {
    //         var url = canvas.toDataURL();;
    //         // console.log(url)
    //         axios.post('/image', { data: url })
    //             .then((res) => {
    //                 console.log(res);
    //             })
    //             .catch((e) => {
    //                 console.log(e);
    //             })
    //     })
    // }
    // snap();
}

