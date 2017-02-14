const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
// const server = require('../server.js');

const should = chai.should();
const assertArrays = require('chai-arrays');

// const app = server.app;
// const storage = server.storage;

const { User, Store } = require('../models');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);
chai.use(assertArrays);

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
    &&    &&    &&&&&   &&&&&&&    &&&&&&
    &&    &&   &&   &&  &&         &&   &&
    &&    &&     &&     &&&&&      &&   &&
    &&    &&       &&   &&         &&&&&
    &&    &&   &&   &&  &&         &&  &&
      &&&&      &&&&&   &&&&&&&    &&   &&

    Test endpoints for User API
*******************************************************/

function getRand(n) {
    return Math.floor(Math.random() * n);
}

function pad(num, size) {
    var s = "000000" + num;
    return s.substr(s.length - size);
}

function generateStoreIds() {
    var store_ids = [];
    let rand = getRand(20);
    while (store_ids.length < 20) {
        store_ids.push(faker.random.number(99999999));
    }
    return store_ids;
}


function generateUserData() {
    var users = [];
    let rand = getRand(15);
    do {
        users.push({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(8),
            address: faker.address.streetAddress(),
            city: faker.address.city(),
            state: faker.address.stateAbbr(),
            zip: faker.address.zipCode(),
            //format 587-753-7028
            phone: faker.phone.phoneNumber(0),
            position: 'Retail Sales Specialist',
            store_ids: generateStoreIds()
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
    // console.warn('Deleting database');
    // return mongoose.connection.dropDatabase();
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

        it('should return users with right fields', function() {

            let resUser;
            return chai.request(app)
                .get('/user')
                .then(function(res) {

                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('array');
                    res.body.should.have.length.of.at.least(1);

                    res.body.forEach(function(user) {
                        user.should.be.a('object');
                        user.should.include.keys('id', 'firstName', 'lastName', 'email',
                            'password', 'address', 'city', 'state', 'zip', 'phone',
                            'position', 'store_ids');
                    });
                    // just check one of the users that its values match with those in db
                    // and we'll assume it's true for rest
                    resUser = res.body[0];
                    return User.findById(resUser.id).exec();
                })
                .then(user => {
                    resUser.firstName.should.equal(user.firstName);
                    resUser.lastName.should.equal(user.lastName);
                    resUser.email.should.equal(user.email);
                    resUser.password.should.equal(user.password);
                    resUser.address.should.equal(user.address);
                    resUser.city.should.equal(user.city);
                    resUser.state.should.equal(user.state);
                    resUser.zip.should.equal(user.zip);
                    resUser.phone.should.equal(user.phone);
                    resUser.position.should.equal(user.position);
                    resUser.store_ids.should.be.equalTo(user.store_ids);
                });
        });
    })
})













/*******************************************************
        &&&&&   
       &&   &&    &&                  &&&&&
         &&     &&&&&&   &&    &&&&&  &&
          &&      &&   &&  &&  &&     &&&&
       &&   &&    &&   &&  &&  &&     &&
        &&&&&     &&     &&    &&     &&&&&

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
            lastRedeemed: faker.date.past()
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

        it('should return stores with right fields', function() {

            let resStore;
            return chai.request(app)
                .get('/store')
                .then(function(res) {

                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('array');
                    res.body.should.have.length.of.at.least(1);

                    res.body.forEach(function(user) {
                        user.should.be.a('object');
                        user.should.include.keys('id', 'name', 'user_assigned_id', 'address',
                            'city', 'state', 'generalComments', 'tier', 'havePaperwork',
                            'wantPaperworkBack', 'lastRedeemed', 'personnel');
                    });
                    // just check one of the users that its values match with those in db
                    // and we'll assume it's true for rest
                    resStore = res.body[0];
                    return Store.findById(resStore.id).exec();
                })
                .then(store => {
                    resStore.name.should.equal(store.name);
                    resStore.user_assigned_id.should.equal(store.user_assigned_id);
                    resStore.address.should.equal(store.address);
                    resStore.city.should.equal(store.city);
                    resStore.state.should.equal(store.state);
                    resStore.generalComments.should.equal(store.generalComments);
                    if (store.tier) resStore.tier.should.equal(store.tier); //if store.tier is not null
                    resStore.tier.should.be.oneOf([store.tier, null]);
                    resStore.havePaperwork.should.equal(store.havePaperwork);
                    resStore.wantPaperworkBack.should.equal(store.wantPaperworkBack);
                    resStore.lastRedeemed.should.equal((store.lastRedeemed).toISOString());
                    // console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++" +
                    //     "\nresStore: " + typeof resStore.personnel);
                    // console.log("store: " + typeof store.personnel);
                    resStore.personnel.length.should.equal(store.personnel.length);
                });
        });
    })
})
