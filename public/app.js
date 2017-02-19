var state = {
    user: {},
    userStores: [],
    currentPage: "index.html"
};


function renderPage(state, page) {
    state.currentPage = page;
    window.location.href = page;
}




function addUser() {
    var pass1 = $("input[name*='password']").val();
    var pass2 = $("input[name*='password2']").val();

    if (pass1 == pass2) {
        var newUser = {
                firstName: $("input[name*='first-name']").val(),
                lastName: $("input[name*='last-name']").val(),
                email: $("input[name*='email']").val(),
                password: $("input[name*='password']").val(),
                address: $("input[name*='address']").val(),
                city: $("input[name*='city']").val(),
                state: $("select[name*='state']").val(),
                zip: $("input[name*='zip']").val(),
                phone: $("input[name*='phone']").val(),
                company: $("input[name*='company']").val(),
                position: $("select[name*='position']").val(),
                store_ids: [] //no stores when creating new account
            }
            //load all the data in newUser var and then post to API
        $("#js-newAccount-form").after("<p>it worked!!!!!!!!</p>");

    } else {
        $("js-newAccount-form").append("< p >Your passwords do not match." +
            "Please try again. < /p>");
    }



    renderPage(state, "index.html");
}

function postAjax(state, endpoint, page, dataObj) {
    var postObj = {
        method: "POST",
        url: endpoint,
        data: dataObj
    }
    ajaxCall(postObj, page);
}

function getAjax(state, endpoint, page, dataObj = null) { //makes dataObj optional
    var getObj = {
        method: "GET",
        url: endpoint
    }

    if (dataObj != null) {
        getObj.data = dataObj;
    }

    ajaxCall(postObj, page);
}

function putAjax(state, endpoint, page, dataObj) { //endpoint must include id
    var putObj = {
        method: "PUT",
        url: endpoint,
        data: dataObj
    }
    ajaxCall(putObj, page);
}

function deleteAjax(state) {

}

function ajaxCall(ajaxObj, page) {
    $.ajax(ajaxObj).done(function() {

        //can do something to state depeding on conditions of state... make cnages depending
        renderPage(page);
    });
}




// this function's name and argument can stay the
// same after we have a live API, but its internal
// implementation will change. Instead of using a
// timeout function that returns mock data, it will
// use jQuery's AJAX functionality to make a call
// to the server and then run the callbackFn
function getUserLogin(callbackFn) {
    // we use a `setTimeout` to make this asynchronous
    // as it would be with a real AJAX call.


    // setTimeout(function() { callbackFn(MOCK_USER_DATA) }, 1);
}





function getStores(callbackFn) {
    // we use a `setTimeout` to make this asynchronous
    // as it would be with a real AJAX call.
    // setTimeout(function() { callbackFn(MOCK_USER_DATA) }, 1);
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
function getAndDisplayStoreData() {
    getStores(displayStores);
}

//  on page load do this
$(function() {
    getAndDisplayStoreData();

    $('#js-newAccount-form').submit(function(event) {
        event.preventDefault();
        var userLogin = {
                email: $("input[name*='user-email']").val(),
                password: $("input[name*='user-password']").val()
            }
            //get user by email and then check that it matches password

        //if it matches, switch pages to profile and generate the 
        //user's stores using store_id
    });


    //create a new account
    $('#js-newAccount-form').submit(function(event) {
        event.preventDefault();
        addUser(state);

    }); // Create account form submission

})
