exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                       'mongodb://dbuser:dbpassword@ds147079.mlab.com:47079/mrkt-tracker';
exports.PORT = process.env.PORT || 8080;