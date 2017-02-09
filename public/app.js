var MOCK_USER_DATA = {
	"users": [
        {
            "firstName": "John",
            "lastName": "Smith",
            "email": "something@nowhere.com",
            "address": "1 Home St.",
            "city": "Boston",
            "state": "MA",
            "zip": "12345",
            "phone": "555-555-5555",
            "position": "Retail Sales Specialist",
            "password": "password",
            "stores": [
                {
                    "name": "A Store Name",
                    "id": "1234567890",
                    "address": "1 Market St.",
                    "city": "Beantown",
                    "state": "MA",
                    "generalComments": "store wants paperwork back",
                    //user can add multiple contacts
                    "person": [
                        {
                            "name": "Jill White",
                            "position": "manager",
                            "comment": "has a son named brian."
                        },
                        {
                            "name": "Chaz Bono",
                            "position": "accountant",
                            "comment": "only works 10-2pm"
                        }
                    ],
                    "tier": "gold",
                    "havePaperwork": true,
                    "wantPaperworkBack": true,
                    "lastRedeemed": "12/12/16" 
                    //use function to also display quarter
                },
                {
                    "name": "A Deli Name",
                    "id": "2234567890",
                    "address": "1 Two Ln.",
                    "city": "Beanville",
                    "state": "MA",
                    "generalComments": "store hates people",
                    //user can add multiple contacts
                    "person": [
                        {
                            "name": "George Burns",
                            "position": "store manager",
                            "comment": "stupid rich bastard."
                        },
                        {
                            "name": "Homer Simpson",
                            "position": "deli manager",
                            "comment": "has very little hair"
                        }
                    ],
                    "tier": "silver",
                    "havePaperwork": false,
                    "wantPaperworkBack": true,
                    "lastRedeemed": "12/12/16" 
                    //use function to also display quarter
                }
            ]
        }
    ]
};

// this function's name and argument can stay the
// same after we have a live API, but its internal
// implementation will change. Instead of using a
// timeout function that returns mock data, it will
// use jQuery's AJAX functionality to make a call
// to the server and then run the callbackFn
function getUserStores(callbackFn) {
    // we use a `setTimeout` to make this asynchronous
    // as it would be with a real AJAX call.
	setTimeout(function(){ callbackFn(MOCK_USER_DATA)}, 1);
}

// this function stays the same when we connect
// to real API later
function displayStores(data) {
    var stores = data.users[0].stores;

    for (index in stores) {
	   $('body').append(
        '<p>' + stores[index].name + '</p>');
    }
}

// this function can stay the same even when we
// are connecting to real API
function getAndDisplayUserData() {
	getUserStores(displayStores);
}

//  on page load do this
$(function() {
	getAndDisplayUserData();
})