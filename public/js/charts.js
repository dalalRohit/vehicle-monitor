let myChart = document.getElementById('type-chart').getContext('2d');

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
console.log(totalTypes);

