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
                state.userStores.push(data);

                //update the user database with the new store id
                putAjax(state, '/user/' + state.user.id, null, { 'store_ids': state.user.store_ids, 'id': state.user.id });

                displayStores(state);
            }
        }
    }
    ajaxCall(postObj, page);
}




function getAjax(state, endpoint, page, dataObj = null) { //makes dataObj optional
    var getObj = {
        method: "GET",
        url: endpoint,
        success: function(data) {
            if (endpoint == '/user') {

                //if username/password matches, add it to our state
                cacheUser(data, dataObj);

                //if no user, give invalid login message
                if (Object.keys(state.user).length == 0) {
                    $('#js-login-form').append('<p class="invalid-user">Email or password does not match. Try again.</p>');


                } else { //login successful

                    // hide the login form
                    $('.user-login').addClass('hide');

                    getAndDisplayStoreData();
                }
            }



            var endArr = endpoint.split('/'); //[0] will be empty string

            //if the endpoint starts with 'store' and suceeded by a string (id)
            if (endArr[1] == 'store' && endArr.length == 3) {
                state.userStores.push(data);

                //if the last store has been loaded into userStores[]
                if (state.userStores.length == state.user.store_ids.length) {

                    displayStores(state);
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
        //find out if there is a existing user, and if there is log in
    getAjax(state, '/user', null, login);
}


//When the email/password matches a user in the database
//add it to our state
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


function getDateString(dateStr) {
    var month = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    var date = new Date(dateStr);
    console.log("dateStr: " + typeof datestr);
    console.log("fullDate: " + month[date.getMonth() - 1]);
    console.log("month: " + date.getMonth());

    return month[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
}






function displayStores(state) {

    $('.store-list').empty();
    var stores = state.userStores;

    for (i in stores) {
        var resultBoxDiv = $('<div>').addClass('store-result box box5 shadow5');
        var tierRound = $('<div>').addClass('tier-round');
        tierRound.append(getTierMedal(state, i));

        //add the medal img to the result box
        // resultBoxDiv.append('<span class=tier-circle>' + tierRound + '</span>');
        resultBoxDiv.append(tierRound);

        //add the store name to the result box
        resultBoxDiv.append('<h3>' + stores[i].name + '</h3>');

        //add the store address
        resultBoxDiv.append('<p>' + stores[i].address + '<br>' +
            stores[i].city + ', ' + stores[i].state + '</p>');

        $('.store-list').append(resultBoxDiv);
    }
}



function getTierMedal(state, index) {

    if (state.userStores[index].tier == 'platinum') {
        return '<img class="tier-medal" src="medal-platinum.png" alt="platinum">';
    } else if (state.userStores[index].tier == 'gold') {
        return '<img class="tier-medal" src="medal-gold.png" alt="gold">';
    } else if (state.userStores[index].tier == 'silver') {
        return '<img class="tier-medal" src="medal-silver.png" alt="silver">'
    } else {
        return '';
    }
}


function getAndDisplayStoreData() {

    //give user button for adding a store
    $('#add-store-button').removeClass('hide');
    $('#add-store-button').addClass('material-icons');
    //show the store results
    $('.store-list').removeClass('hide');

    //create the userStore[] from store_ids[]
    for (var i = 0; i < state.user.store_ids.length; i++) {
        getAjax(state, '/store/' + state.user.store_ids[i], null);
    }

}

//  on page load do this
$(function() {
    // $('.date-picker').val(new Date().toDateInputValue());
    // document.getElementById('paperwork-received').value = new Date().toDateInputValue();
    // document.getElementById('paperwork-received').valueAsDate = new Date();

    //allow user to enter username/password
    $('#sign-in').on('click', function(event) {
        event.preventDefault();
        $('#js-login-form').removeClass('hide');
    });

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
        document.getElementById("js-newStore-form").reset();

        //hide create-store button
        $('#add-store-button').addClass('hide');
        $('#add-store-button').removeClass('material-icons');
        //hide store-results and then show create-store form
        $('.store-list').addClass('hide');
        $('.create-store').removeClass('hide');
        $(this).addClass('hide');
    });


    //create a store
    $('#js-newStore-form').submit(function(event) {
        event.preventDefault();
        addStore(state);

        //hide creating a store form
        $('.create-store').addClass('hide');
        //show add-store button and store results list. Add styling to button.
        $('#add-store-button').removeClass('hide');
        $('#add-store-button').addClass('material-icons');
        $('.store-list').removeClass('hide');
    });


    //cancel creating a new store
    $('#cxl-create-store').on('click', function(event) {
        event.preventDefault();

        //hide creating a store
        $('.create-store').addClass('hide');
        //show add-store button and store results list (add class for button styling)
        $('#add-store-button').removeClass('hide');
        $('#add-store-button').addClass('material-icons');
        $('.store-list').removeClass('hide');
    });

    //cancel creating a new account
    $('#cxl-createaccount').on('click', function(event){
        event.preventDefault();

        window.location.href = '/index.html';
    });

    //click on a store result for more details
    $(document).on('click', '.store-result box box5 shadow5', function(event) {
        $(this).addClass('details');
    });

    $(document).on('click', '.details', function(event) {
        $(this).removeClass('details');
    });
})
