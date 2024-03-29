// exports.DATABASE_URL = process.env.DATABASE_URL ||
//     global.DATABASE_URL ||
//     'mongodb://dbuser:dbpassword@ds147079.mlab.com:47079/mrkt-tracker';



exports.DATABASE_URL = process.env.DATABASE_URL ||
    global.DATABASE_URL ||
    (process.env.NODE_ENV === 'test' ?
        process.env.TEST_DB_URL : process.env.DB_URL);
exports.PORT = process.env.PORT || 8080;
