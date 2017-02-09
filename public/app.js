

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