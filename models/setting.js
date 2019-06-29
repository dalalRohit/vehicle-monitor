let url, db_name;
if (process.env.NODE_ENV == 'test') {
    url = process.env.LOCAL_DB_URL;
    db_name = 'veichle';
}
else {
    url = process.env.MLAB_DB_URL;
    db_name = 'vehicle-monitor';
}

module.exports = { url, db_name };