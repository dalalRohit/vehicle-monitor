//setup webcam

var video = document.querySelector('.player');
var entryVideo = document.querySelector('#entryVideoPlayer');
var exitPlayer = document.querySelector('#exitVideoPlayer');
var vendorUrl = window.URL || webkitURL;
navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;

//capture https://stackoverflow.com/questions/27120757/failed-to-execute-createobjecturl-on-url
navigator.getMedia({
    video: true,
    audio: false
}, function (stream) {
    // console.log(stream);
    entryVideo.srcObject = stream;
    exitPlayer.srcObject = stream;
    entryVideo.play();
    exitPlayer.play();
}, function (err) {
    console.log(err);
})

var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');
var flash = document.getElementById('flash');
flash.style.display = 'none';
var w, h, ratio;
canvas.style.display = 'none';

entryVideo.addEventListener('loadedmetadata', function () {
    ratio = entryVideo.videoWidth / entryVideo.videoHeight;
    w = entryVideo.videoWidth - 100;
    h = parseInt(w / ratio, 10);
    canvas.width = w;
    canvas.height = h;
}, false);


//capture screenshot
async function snap() {
    context.fillRect(0, 0, w, h);
    context.drawImage(entryVideo, 0, 0, w, h);
    canvas.style.display = 'block';
}

//front end form validation
function handleForm() {
    snap();
    let vType = $("#v-type :selected").val();
    let vState = $("#v-state :selected").val();
    let vArea = $("#a-code :selected").val();
    let vSeries = document.getElementById('v-series').value.toUpperCase();
    let vNumber = document.getElementById('v-number').value;
    if (vType === '' || vState === '' || vArea === '' || vSeries === '' || vNumber === '') {
        flash.innerHTML = 'Enter all fields';
        flash.classList = "alert alert-danger";
        flash.style.display = 'block';
    }
    var url = canvas.toDataURL();
    let formData = {
        type: vType,
        state: vState,
        area: vArea,
        series: vSeries,
        number: vNumber,
        imageUrl: url
    }
    axios.post('/validate', { data: formData })
        .then((res) => {
            if (flash.classList.length > 0) {
                flash.classList = ''
            }
            flash.className = `alert alert-${res.data.type}`
            flash.innerHTML = res.data.msg
            flash.style.display = 'block';

            loadEnteredVehicles();
        })
        .catch((err) => {
            console.log(err);
        })

}

//get vehicles inside campus
function loadEnteredVehicles() {
    axios.get('/entered').then((res) => {
        let x = res.data;
        x.map((i) => {
            $('#exitSelect')
                .append(`<option value=${i.numberplate}>${i.numberplate}</option>`)
        })
    })
}

//manage vehicles exiting 
function handleExit() {
    let exitV = $('#exitSelect').val();
    // console.log(exitV);
    axios.post('/exit', { number: exitV })
        .then((res) => {
            console.log(res);
            flash.className = `alert alert-success`
            flash.innerHTML = res.data.msg
            flash.style.display = 'block';
            $('#exitSelect').find('option').remove();

            loadEnteredVehicles();

        })

}


window.onload = function () {
    loadEnteredVehicles();
}

