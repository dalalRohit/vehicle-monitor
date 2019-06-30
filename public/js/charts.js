let myChart = document.getElementById('type-chart').getContext('2d');
var flash = document.getElementById('flash');
var photo = document.getElementById('photo');
flash.style.display = 'none';
photo.style.display = 'none';

var totalTypes = null;
axios.get('/admin/types')
    .then((res) => {
        totalTypes = res.data.count;
        let typePlot = new Chart(myChart, {
            type: 'bar',
            data: {
                labels: ['Car', 'Bike/Scooter', 'Auto', 'Bus', 'Truck', 'Van', 'Other'],
                datasets: [{
                    label: 'Veichle types',
                    data: totalTypes
                }]
            },
            options: {}
        })

    })

function getVehicle() {
    let number = document.getElementById('v-number').value;
    number = number.toUpperCase();
    if (number === '') {
        alert('Number required!');
    }
    else {
        axios.get(`/veichle?number=${number}`)
            .then((res) => {

                //get vehicle image from DB
                flash.classList = `text-center alert alert-${res.data.type}`;
                flash.style.display = 'block';
                flash.innerHTML = res.data.msg
                if (res.data.img) {
                    var arrayBufferView = new Uint8Array(res.data.img.data);
                    var blob = new Blob([arrayBufferView], { type: "image/jpeg" });
                    var urlCreator = window.URL || window.webkitURL;
                    var imageUrl = urlCreator.createObjectURL(blob);
                    photo.src = imageUrl;
                    photo.style.display = 'block';
                }



            })
    }
}
