require('dotenv').config();

const { MongoClient } = require('mongodb');
let url, db_name = null;
if (process.env.NODE_ENV === 'test') {
    url = process.env.LOCAL_DB_URL
    db_name = 'veichle';
}
else {
    url = process.env.MLAB_DB_URL
    db_name = 'vehicle-monitor'
}
MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    var db = client.db(db_name);
    var data = [
        { type: 'Car', state: 'MH', area: '04', series: 'GU', number: '8598', is: 'white' },
        { type: 'Auto', state: 'JK', area: '10', series: 'GV', number: '1234', is: 'black' },
        { type: 'Truck', state: 'DL', area: '07', series: 'GY', number: '3456', is: 'black' },
        { type: 'Van', state: 'GA', area: '12', series: 'AB', number: '1111', is: 'white' },
        { type: 'Auto', state: 'JH', area: '03', series: 'CD', number: '2222', is: 'black' },
        { type: 'Truck', state: 'AN', area: '01', series: 'EF', number: '3333', is: 'black' },
        { type: 'Bike/scooter', state: 'WB', area: '29', series: 'GH', number: '4444', is: 'white' }
    ];

    data.map((c) => {
        c = c['numberplate'] = `${c['state']}-${c['area']}-${c['series']}-${c['number']}`;
    })
    db.collection('lists').insertMany(data, (err, res) => {
        if (!err) {
            console.log("Records inserted succesfully!");
        }
        else {
            console.log("Unable to insert multiple records!");
        }


    });

    client.close();
});
