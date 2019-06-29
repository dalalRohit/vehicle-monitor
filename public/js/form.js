
var video = document.querySelector('video');
var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');
var flash = document.getElementById('flash');
flash.style.display = 'none';
var w, h, ratio;
canvas.style.display = 'none';

video.addEventListener('loadedmetadata', function () {
    ratio = video.videoWidth / video.videoHeight;
    w = video.videoWidth - 100;
    h = parseInt(w / ratio, 10);
    canvas.width = w;
    canvas.height = h;
}, false);

async function snap() {
    context.fillRect(0, 0, w, h);
    context.drawImage(video, 0, 0, w, h);
    canvas.style.display = 'block';


}

function handleForm() {
    //get all form fields
    snap();
    let vType = $("#v-type :selected").val();
    let vState = $("#v-state :selected").val();
    let vArea = $("#a-code :selected").val();
    let vSeries = document.getElementById('v-series').value.toUpperCase();
    let vNumber = document.getElementById('v-number').value;
    if (vType === '' || vState === '' || vArea === '' || vSeries === '' || vNumber === '') {
        // alert('Enter all fields');
        flash.innerHTML = 'Enter all fields';
        flash.classList = "alert alert-danger";
        flash.style.display = 'block';
    }
    // console.log(vType, vState, vArea, vSeries, vNumber);
    var url = canvas.toDataURL();
    // console.log(url);
    let formData = {
        type: vType,
        state: vState,
        area: vArea,
        series: vSeries,
        number: vNumber,
        imageUrl: url
    }
    // console.log(url)
    axios.post('/validate', { data: formData })
        .then((res) => {
            if (flash.classList.length > 0) {
                flash.classList = ''
            }
            flash.className = `alert alert-${res.data.type}`
            flash.innerHTML = res.data.msg
            flash.style.display = 'block';
        })
        .catch((err) => {
            console.log(err);
        })

}
