var state = {
    user: {},
    userStores: [],
    currentPage: "index.html"
};


function renderPage(state, page) {
    state.currentPage = page;
    window.location.href = page;
}


function addUser(state) {
    var pass1 = $("input[name*='password']").val();
    var pass2 = $("input[name*='password2']").val();

    if (pass1 == pass2) {
        var newUser = {
            "firstName": $("input[name*='firstName']").val(),
            "lastName": $("input[name*='lastName']").val(),
            "email": $("input[name*='email']").val(),
            "password": $("input[name*='password']").val(),
            "address": $("input[name*='address']").val(),
            "city": $("input[name*='city']").val(),
            "state": $("select[name*='state']").val(),
            "zip": $("input[name*='zip']").val(),
            "phone": $("input[name*='phone']").val(),
            "company": $("input[name*='company']").val(),
            "position": $("select[name*='position']").val(),
            "store_ids": [] //no stores when creating new account
        }

        //load all the data in newUser var and then post to API
        postAjax(state, '/user', 'index.html', newUser);
        $("#js-newAccount-form").after("<p>it worked!!!!!!!!</p>");

    } else {
        $("js-newAccount-form").append("<p>Your passwords do not match." +
            "Please try again. </p>");
    }
}

function addStore(state) {
    var newStore = {
        "name": $("input[name*='store-name']").val(),
        "user_assigned_id": $("input[name*='store-id']").val(),
        "address": $("input[name*='address']").val(),
        "city": $("input[name*='city']").val(),
        "state": $("select[name*='state']").val(),
        "generalComments": $("input[name*='general-comments']").val(),
        "tier": $("select[name*='tier']").val(),
        "havePaperwork": $("input[name*='have-paperwork']").val(),
        "wantsPaperworkBack": $("input[name*='wants-paperwork']").val(),
        "lastRedeemed": $("#last-redeemed").val(),
        "personnel": []
    }

    //create a new store in the store database
    postAjax(state, '/store', null, newStore);


}







function postAjax(state, endpoint, page, dataObj) {
    var postObj = {
        contentType: 'application/json',
        method: "POST",
        url: endpoint,
        dataType: "json",
        data: JSON.stringify(dataObj),
        success: function(data) {
            if (endpoint == '/store') {
                //take the id of this store and push to the user's store_ids[]
                state.user.store_ids.push(data.id);

                //update the user database with the new store id
                putAjax(state, '/user/' + state.user.id, null, { 'store_ids': state.user.store_ids, 'id': state.user.id });
            }
        }
    }
    console.log("page in postAjax: " + page);
    ajaxCall(postObj, page);
}




function getAjax(state, endpoint, page, dataObj = null) { //makes dataObj optional
    var getObj = {
        method: "GET",
        url: endpoint,
        success: function(data) {
            if (endpoint == '/user') {
                cacheUser(data, dataObj);

                //if no user, give invalid login message
                if (Object.keys(state.user).length == 0) {
                    $('#js-login-form').append('<p class="invalid-user">Email or password does not match. Try again.</p>');
                } else {
                    //Otherwise, log in the user by hiding login form 
                    //and displaying the user's stores
                    $('#js-login-form').addClass('hide');
                    getAndDisplayStoreData();
                }
            }
        }
    }
    if (dataObj != null) {
        getObj.data = dataObj;
    }
    return ajaxCall(getObj, page);
}




function putAjax(state, endpoint, page, dataObj) { //endpoint must include id
    var putObj = {
        type: "PUT",
        url: endpoint,
        contentType: 'application/json',
        dataType: "json",
        data: JSON.stringify(dataObj)
    }
    ajaxCall(putObj, page);
}




function deleteAjax(state, endpoint, page, dataObj) { //endpoint must include id
    var putObj = {
        method: "DELETE",
        url: endpoint,
        data: dataObj
    }
    ajaxCall(putObj, page);
}




function ajaxCall(ajaxObj, page) {
    $.ajax(ajaxObj).done(function() {
        //can do something to state depending on conditions
        if (page != null) {
            renderPage(state, page);
        }
    });
}











function getUserLogin() {
    var login = {
        "email": $("input[name*='user-email']").val(),
        "password": $("input[name*='user-password']").val()
    }
    getAjax(state, '/user', null, login);
}

function cacheUser(data, login) {
    //for every user in array
    for (var i = 0; i < data.length; i++) {
        //if user the user email && passwords match
        if (data[i].email == login.email &&
            data[i].password == login.password) {
            state.user = data[i];
            //don't save password in state
            for (var prop in data[i]) {
                if (prop != 'password') {
                    state.user[prop] = data[i][prop];
                }
            }
            break;
        }
    }
}



function generateStores() {



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

    //give user button for adding a store
    $('#add-store-button').removeClass('hide');

    generateStores();
}

//  on page load do this
$(function() {
    // $('.date-picker').val(new Date().toDateInputValue());
    // document.getElementById('paperwork-received').value = new Date().toDateInputValue();
    // document.getElementById('paperwork-received').valueAsDate = new Date();


    //create a new account
    $('#js-newAccount-form').submit(function(event) {
        event.preventDefault();
        addUser(state);
    });

    //login to account
    $('#js-login-form').submit(function(event) {
        event.preventDefault();
        //if the user has already attempted to login
        $('.invalid-user').remove();
        getUserLogin();
    });

    //open up new store form
    $('#add-store-button').on('click', function(event) {
        event.preventDefault();
        $('.create-store').removeClass('hide');
    });

    //create a store
    $('#js-newStore-form').submit(function(event) {
        event.preventDefault();
        addStore(state);
        $('.create-store').addClass('hide');
        document.getElementById("js-newStore-form").reset();
    });
})
