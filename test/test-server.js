const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
// const server = require('../server.js');

const should = chai.should();
// const app = server.app;
// const storage = server.storage;

const { User, Store } = require('../models');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);

/*******************************************************
    Test for pages to open
*******************************************************/
describe('index page', function() {
    it('exists', function(done) {
        chai.request(app)
            .get('/')
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.html;
                done();
            });
    });
});

describe('create account page', function() {
    it('exists', function(done) {
        chai.request(app)
            .get('/create-account.html')
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.html;
                done();
            });
    });
});

describe('user landing page', function() {
    it('exists', function(done) {
        chai.request(app)
            .get('/user-landing.html')
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.html;
                done();
            });
    });
});

describe('profile page', function() {
    it('exists', function(done) {
        chai.request(app)
            .get('/profile.html')
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.html;
                done();
            });
    });
});



/*******************************************************
    Test endpoints for User API
*******************************************************/

function getRand(n) {
    return Math.floor(Math.random() * n);
}

function pad(num, size) {
    var s = "000000" + num;
    return s.substr(s.length - size);
}

function generateStoreIds(){
    var store_ids = [];
    let rand = getRand(20);
    while(store_ids.length < 20){
        store_ids.push(faker.random.number);
    }
    return store_ids;
}


function generateUserData() {
    var users = [];
    let rand = getRand(10);
    do {
        users.push({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(8),
            city: faker.address.city(),
            state: faker.address.stateAbbr(),
            zip: faker.address.zipCode(),
            //format 587-753-7028
            phone: faker.phone.phoneNumber(0),
            position: 'Retail Sales Specialist',
            store_ids: generateStoreIds
        });
    } while (users.length < rand);

    return User.insertMany(users);
}



// this function deletes the entire database
// so that nothing is left over after the test
function tearDownDb() {
    return new Promise((resolve, reject) => {
        console.warn('Deleting database');
        mongoose.connection.dropDatabase()
            .then(result => resolve(result))
            .catch(err => reject(err))
    });
}

describe('Users API resource', function() {
    before(function() {
        return runServer(TEST_DATABASE_URL);
    });
    beforeEach(function() {
        return generateUserData();
    });
    afterEach(function() {
        return tearDownDb();
    });
    after(function() {
        return closeServer();
    })

    describe('GET endpoint', function() {

        it('should return all existing users', function() {
            let res;
            return chai.request(app)
                .get('/user')
                .then(_res => {
                    res = _res;
                    res.should.have.status(200);
                    res.body.should.have.length.of.at.least(1);
                    return User.count();
                })
                .then(count => {
                    res.body.should.have.length.of(count);
                });
        });
    })
})













/*******************************************************
    Test endpoints for Store API
*******************************************************/

function generatePersonnel() {
    var personnel = [];
    var rand = getRand(5);
    do {
        personnel.push({
            name: faker.name.findName(),
            position: faker.name.jobTitle(),
            comment: faker.lorem.sentences(2)
        })
    } while (personnel.length < rand);
    return personnel;
}

function generateStoreData() {
    var stores = [];

    var rand = getRand(50);
    do {
        stores.push({
            name: faker.company.companyName(),
            user_assigned_id: faker.random.word().charAt[0] + pad(getRand(999999), 6),
            address: faker.address.streetAddress(),
            city: faker.address.city(),
            state: faker.address.stateAbbr(),
            generalComments: faker.lorem.sentences(2),
            tier: faker.random.arrayElement(
                ['silver', 'gold', 'platinum']),
            personnel: generatePersonnel(),
            havePaperwork: faker.random.boolean(),
            wantPaperworkBack: faker.random.boolean(),
            lastRedeemed: faker.date.past(2)
        });
    } while (stores.length < rand);
    return Store.insertMany(stores);
}

describe('Store API resource', function() {
    before(function() {
        return runServer(TEST_DATABASE_URL);
    });
    beforeEach(function() {
        return generateStoreData();
    });
    afterEach(function() {
        return tearDownDb();
    });
    after(function() {
        return closeServer();
    })

    describe('GET endpoint', function() {

        it('should return all existing stores', function() {
            let res;
            return chai.request(app)
                .get('/store')
                .then(_res => {
                    res = _res;
                    res.should.have.status(200);
                    res.body.should.have.length.of.at.least(1);
                    return Store.count();
                })
                .then(count => {
                    res.body.should.have.length.of(count);
                });
        });
    })
})

