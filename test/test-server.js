const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
// const server = require('../server.js');

const should = chai.should();
const assertArrays = require('chai-arrays');

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
    &&    &&   &&&&&   &&&&&&&  &&&&&&
    &&    &&  &&   &&  &&       &&   &&
    &&    &&    &&     &&&&&    &&   &&
    &&    &&      &&   &&       &&&&&
    &&    &&  &&   &&  &&       &&  &&
      &&&&     &&&&&   &&&&&&&  &&   &&

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


function seedUserData() {
    var users = [];
    let rand = getRand(15);
    do {
        users.push(generateUser());
    } while (users.length < rand);

    return User.insertMany(users);
}

function generateUser() {
    return {
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
    };
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
        return seedUserData();
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
    });


    describe('POST endpoint', function() {
        it('should add a new user', function() {

            const newUser = generateUser();

            return chai.request(app)
                .post('/user')
                .send(newUser)
                .then(function(res) {
                    res.should.have.status(201);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.include.keys('id', 'firstName', 'lastName', 'email',
                        'password', 'address', 'city', 'state', 'zip', 'phone',
                        'position', 'store_ids');
                    res.body.firstName.should.equal(newUser.firstName);
                    res.body.lastName.should.equal(newUser.lastName);
                    res.body.email.should.equal(newUser.email);
                    res.body.password.should.equal(newUser.password);
                    res.body.address.should.equal(newUser.address);
                    res.body.city.should.equal(newUser.city);
                    res.body.state.should.equal(newUser.state);
                    res.body.zip.should.equal(newUser.zip);
                    res.body.phone.should.equal(newUser.phone);
                    res.body.position.should.equal(newUser.position);
                    res.body.store_ids.should.be.equalTo(newUser.store_ids);
                    return User.findById(res.body.id).exec();
                })
                .then(function(user) {
                    newUser.firstName.should.equal(user.firstName);
                    newUser.lastName.should.equal(user.lastName);
                    newUser.email.should.equal(user.email);
                    newUser.password.should.equal(user.password);
                    newUser.address.should.equal(user.address);
                    newUser.city.should.equal(user.city);
                    newUser.state.should.equal(user.state);
                    newUser.zip.should.equal(user.zip);
                    newUser.phone.should.equal(user.phone);
                    newUser.position.should.equal(user.position);
                    newUser.store_ids.should.be.equalTo(user.store_ids);
                });
        });
    });


    // describe('PUT endpoint', function() {

    //     it('should update fields you send over', function() {
    //         const updateData = {
    //             address: faker.address.streetAddress(),
    //             password: faker.internet.password(8),
    //             store_ids: generateStoreIds()
    //         };

    //         return User
    //             .findOne()
    //             .exec()
    //             .then(user => {
    //                 updateData.id = user.id;

    //                 return chai.request(app)
    //                     .put('/user')
    //                     .send(updateData);
    //             })
    //             .then(res => {
    //                 res.should.have.status(204);
    //                 res.body.should.be.a('object');
    //                 res.body.address.should.equal(updateData.address);
    //                 res.body.password.should.equal(updateData.password);
    //                 res.body.store_ids.should.equalTo(updateData.store_ids);

    //                 return User.findById(res.body.id).exec();
    //             })
    //             .then(user => {
    //                 user.address.should.equal(updateData.title);
    //                 user.internet.should.equal(updateData.content);
    //                 user.store_ids.should.equalTo(updateData.store_ids);
    //             });
    //     });
    // });


    describe('DELETE endpoint', function() {
        it('should delete a post by id', function() {
            let user;

            return User
                .findOne()
                .exec()
                .then(_user => {
                    user = _user;
                    return chai.request(app).delete(`/user/${user.id}`);
                })
                .then(res => {
                    res.should.have.status(204);
                    return User.findById(user.id);
                })
                .then(_user => {
                    // when a variable's value is null, chaining `should`
                    // doesn't work. so `_post.should.be.null` would raise
                    // an error. `should.be.null(_post)` is how we can
                    // make assertions about a null value.
                    should.not.exist(_user);
                });
        });
    });
});













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


    while (personnel.length < rand) {
        personnel.push(generatePerson());
        return personnel;
    };
}

function generatePerson() {
    return {
        name: faker.name.findName(),
        position: faker.name.jobTitle(),
        comment: faker.lorem.sentences(2)
    };
}

function seedStoreData() {
    var stores = [];
    var rand = getRand(50);

    while (stores.length < rand) {
        stores.push(generateStore());
    };
    return Store.insertMany(stores);
}

function generateStore() {
    return {
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
    }
}

describe('Store API resource', function() {
    before(function() {
        return runServer(TEST_DATABASE_URL);
    });
    beforeEach(function() {
        return seedStoreData();
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

                    res.body.forEach(function(store) {
                        store.should.be.a('object');
                        store.should.include.keys('id', 'name', 'user_assigned_id', 'address',
                            'city', 'state', 'generalComments', 'tier', 'havePaperwork',
                            'wantPaperworkBack', 'lastRedeemed', 'personnel');
                    });
                    resStore = res.body[0];
                    return Store.findById(resStore.id).exec();
                })
                .then(store => {
                    resStore.name.should.equal(store.name);
                    resStore.user_assigned_id.should.equal(store.user_assigned_id);
                    resStore.address.should.equal(store.address);
                    resStore.city.should.equal(store.city);
                    resStore.state.should.equal(store.state);
                    resStore.generalComments.should.be.oneOf([store.generalComments, null]);
                    resStore.tier.should.equal(store.tier);
                    resStore.havePaperwork.should.equal(store.havePaperwork);
                    resStore.wantPaperworkBack.should.equal(store.wantPaperworkBack);
                    resStore.lastRedeemed.should.equal((store.lastRedeemed).toISOString());
                    // console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++" +
                    //     "\nresStore: " + typeof resStore.personnel);
                    // console.log("store: " + typeof store.personnel);
                    resStore.personnel.length.should.equal(store.personnel.length);
                });
        });
    });

    describe('POST endpoint', function() {
        it('should add a new store', function() {

            const newStore = generateStore();

            return chai.request(app)
                .post('/store')
                .send(newStore)
                .then(function(res) {
                    res.should.have.status(201);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.include.keys('id', 'name', 'user_assigned_id', 'address',
                        'city', 'state', 'generalComments', 'tier', 'havePaperwork',
                        'wantPaperworkBack', 'lastRedeemed', 'personnel');
                    res.body.name.should.equal(newStore.name);
                    res.body.user_assigned_id.should.equal(newStore.user_assigned_id);
                    res.body.address.should.equal(newStore.address);
                    res.body.city.should.equal(newStore.city);
                    res.body.state.should.equal(newStore.state);
                    res.body.generalComments.should.equal(newStore.generalComments);
                    res.body.tier.should.equal(newStore.tier);
                    res.body.havePaperwork.should.equal(newStore.havePaperwork);
                    res.body.wantPaperworkBack.should.equal(newStore.wantPaperworkBack);
                    res.body.lastRedeemed.should.equal((newStore.lastRedeemed).toISOString());
                    res.body.personnel.forEach(function(value, index) {
                        for (var prop in value) {
                            if (prop != "_id") {
                                value[prop].should.equal(newStore.personnel[index][prop]);
                            }
                        }
                    });
                    return Store.findById(res.body.id).exec();
                })
                .then(function(store) {
                    newStore.name.should.equal(store.name);
                    newStore.user_assigned_id.should.equal(store.user_assigned_id);
                    newStore.address.should.equal(store.address);
                    newStore.city.should.equal(store.city);
                    newStore.state.should.equal(store.state);
                    newStore.generalComments.should.equal(store.generalComments);
                    newStore.tier.should.equal(store.tier);
                    newStore.havePaperwork.should.equal(store.havePaperwork);
                    newStore.wantPaperworkBack.should.equal(store.wantPaperworkBack);
                    // console.log("+++++++++++++++++++++++++++++++++++++++++++++++++\n" +
                    //     "newStore: " + typeof newStore.lastRedeemed +
                    //     "\nstore: " + typeof store.lastRedeemed);
                    newStore.lastRedeemed.toString().trim().should
                        .equal(store.lastRedeemed.toString().trim());
                    newStore.personnel.forEach(function(value, index) {
                        for (var prop in value) {
                            value[prop].should.equal(store.personnel[index][prop]);
                        }
                    });
                });
        });
    });


    // describe('PUT endpoint', function() {

    //     it('should update fields you send over', function() {
    //         const updateData = {
    //             address: faker.address.streetAddress(),
    //             city: faker.address.city,
    //             personnel: generatePersonnel()
    //         };

    //         return Store
    //             .findOne()
    //             .exec()
    //             .then(store => {
    //                 updateData.id = store.id;
    //                 // console.log("****************************" + 
    //                 //   "\nstore:\n" + store);

    //                 return chai.request(app)
    //                     .put(`/store/${store.id}`)
    //                     .send(updateData);
    //             })
    //             .then(res => {
    //                 res.should.have.status(201);
    //                 res.should.be.json;
    //                 res.body.should.be.a('object');
    //                 res.body.address.should.equal(updateData.address);
    //                 res.body.password.should.equal(updateData.password);
    //                 res.body.store_ids.should.equalTo(updateData.store_ids);

    //                 return store.findById(res.body.id).exec();
    //             })
    //             .then(store => {
    //                 store.address.should.equal(updateData.title);
    //                 store.internet.should.equal(updateData.content);
    //                 store.store_ids.should.equalTo(updateData.store_ids);
    //             });
    //     });
    // });


    describe('DELETE endpoint', function() {
        it('should delete a post by id', function() {
            let store;

            return Store
                .findOne()
                .exec()
                .then(_store => {
                    store = _store;
                    return chai.request(app).delete(`/store/${store.id}`);
                })
                .then(res => {
                    res.should.have.status(204);
                    return Store.findById(store.id);
                })
                .then(_store => {
                    // when a variable's value is null, chaining `should`
                    // doesn't work. so `_post.should.be.null` would raise
                    // an error. `should.be.null(_post)` is how we can
                    // make assertions about a null value.
                    should.not.exist(_store);
                });
        });
    });
});
