const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server.js');
const faker = require('faker');

const should = chai.should();
// const app = server.app;
const storage = server.storage;

const { User } = require('../models');
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
    Test endpoints
*******************************************************/

function getRand(n){
  return Math.floor(Math.random() * n);
}
function pad(num, size) {
var s = "000000" + num;
return s.substr(s.length-size);
}

function generatePersonnel() {
    var personnel = [];
    var rand = getRand(5);
    do {
        personnel.push({
            name: faker.name.findName(),
            position: faker.name.jobTitle(),
            comment: faker.lorem.sentences(2)
        })
    } while (personnel.length < rand); //no more than 5 people
    return personnel;
}

function generateStores() {
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
            tier: faker.random.arrayElement(['silver', 'gold', 'platinum']),
            personnel: generatePersonnel(),
            havePaperwork: faker.random.boolean(),
            wantPaperworkBack: faker.random.boolean(),
            lastRedeemed: faker.date.past(2)
        });
    } while (stores.length < rand);
    return stores;
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
            phone: faker.phone.phoneNumber(0), //format 587-753-7028
            position: 'Retail Sales Specialist',
            stores: generateStores()
        });
    } while (users.length < rand);
}
