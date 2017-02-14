// exports.DATABASE_URL = process.env.DATABASE_URL ||
//     global.DATABASE_URL ||
//     'mongodb://dbuser:dbpassword@ds147079.mlab.com:47079/mrkt-tracker';




exports.DATABASE_URL = process.env.DATABASE_URL ||
    global.DATABASE_URL ||
    (process.env.NODE_ENV === 'test' ?
        'mongodb://dbuser:dbpassword@ds153179.mlab.com:53179/mrkt-tracker-test' :
        'mongodb://dbuser:dbpassword@ds147079.mlab.com:47079/mrkt-tracker');
exports.PORT = process.env.PORT || 8080;
