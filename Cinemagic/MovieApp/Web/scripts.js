
//Populate the owned and wanted lists when the app starts
$(document).ready(function () {
    var serverLocation = "http://localhost:52696/Api/Movies/";

//Populate lists
populateExistingMovies();
populateWantedMovies();

//When the submit button is clicked for the owned movie modal, save it.
$('#submitOwned').click(function(event) {
    var itemTitle, itemDescription, itemPrice, owned;
    itemTitle = document.getElementById("OwnedTitle");
    itemDescription = document.getElementById("OwnedDescription");
    itemPrice = document.getElementById("OwnedPrice");
    postRequestForMovies(0, itemTitle, itemDescription, itemPrice, true, serverLocation);

    window.setTimeout(function (form) {
        populateExistingMovies();
    }, 1000);
});

//When the submit button is clicked for the wanted movie modal, save it.
$('#submitWanted').click(function (event) {
    var itemTitle, itemDescription, itemPrice, owned;
    itemTitle = document.getElementById("WantedTitle");
    itemDescription = document.getElementById("WantedDescription");
    itemPrice = document.getElementById("WantedPrice");
    postRequestForMovies(0, itemTitle, itemDescription, itemPrice, false, serverLocation);

    window.setTimeout(function (form) {
        populateWantedMovies();
    }, 1000);  
});



//When any button with the deleteButton class is clicked in the list container, call the delete function
$('.list-container').on('click', '.deleteButton', function () {
    console.log("clicked delete");
    var deleteid = $(this).closest("li").attr("id");
    var confirmBox = confirm("Are you sure you want to delete this movie?");
    if (confirmBox == true) {
        deleteMovie(deleteid, serverLocation);
        populateExistingMovies();
        populateWantedMovies();
    } else {
        alert("The Movie was not deleted");
    };
});

//When any button with the editButton class is clicked, use the Id to get the movie info and populate the modal.
$('.list-container').off().on('click', '.editButton', function () {
        var editId = $(this).closest("li").attr("id");
        $.ajax({
            url: "http://localhost:52696/Api/Movies/GetMovie?id=" + editId,
            success: function (result, status) {
                $('#editTitle').val(result.Title);
                $('#editDescription').val(result.Description);
                $('#editPrice').val(result.Price);

            }
        });
        

        //When the editSubmit button is clicked, send a request to save the movie use the populated info.
        $('#editMovie').off().on('click', '.editSubmit', function () {
            title = document.getElementById("editTitle");
            description = document.getElementById("editDescription");
            price = document.getElementById("editPrice");
            var isOwned;
            $.ajax({
                url: "http://localhost:52696/Api/Movies/GetMovie?id=" + editId,
                success: function (result, status) {
                    isOwned = result.IsOwned;
                    postRequestForMovies(editId, title, description, price, isOwned, serverLocation);
                }           
            });

            window.setTimeout(function (form) {
                populateWantedMovies();
                populateExistingMovies();
            }, 1000);

        });

    });
});


//Populate the owned movies list
function populateExistingMovies() {
    $.ajax({
        url: "http://localhost:52696/Api/Movies/OwnedMovies",
        success: function (result, status) {
            $("#ownedMovies").empty();
            for (i = 0; i < result.length; i++) {
                $("#ownedMovies").append(
                    '<li class="list-group-item col-xs-12 col-md-12" id="' +
                    result[i].Id + '"><div class ="col-xs-12 col-md-8">' + result[i].Title + ' - ' +
                    result[i].Description + ' - $' + result[i].Price +
                    '</div><div class="col-xs-12 col-md-4"><button class = "deleteButton secondary-btn btn btn-secondary pull-right">delete</button>' +
                    '<button class = "editButton submit-btn btn btn-primary pull-right" data-toggle="modal" data-target="#editMovie"">edit</button></div></li > ');
            }
        }
    });
};

//Populate wanted movie list
function populateWantedMovies() {
    $.ajax({
        url: "http://localhost:52696/Api/Movies/WantedMovies",
        success: function (result, status) {
            $("#wantedMovies").empty();
            for (i = 0; i < result.length; i++) {
                $("#wantedMovies").append(
                    '<li class="list-group-item col-xs-12 col-md-12" id="' +
                    result[i].Id + '"><div class="col-xs-12 col-md-8">' + result[i].Title + ' - ' +
                    result[i].Description + ' - $' + result[i].Price +
                    '</div><div class="col-xs-12 col-md-4"><button class="deleteButton secondary-btn btn btn-secondary pull-right">delete</button>' +
                    '<button class="editButton submit-btn btn btn-primary pull-right" data-toggle="modal" data-target="#editMovie" ">edit</button></div ></li >');
            }
        }
    });
}


//Client side search for owned movies list
function searchMovies() {
    var input, filter, ul, li, ul2, li2, a, b, i, list, list2;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();


    ul = document.getElementById("ownedMovies");
    li = ul.getElementsByTagName("li");

    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("div")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }

    ul2 = document.getElementById("wantedMovies");
    li2 = ul2.getElementsByTagName("li");
    for (i = 0; i < li2.length; i++) {
        b = li2[i].getElementsByTagName("div")[0];
        if (b.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li2[i].style.display = "";
        } else {
            li2[i].style.display = "none";
        }
    }
};

//Save a movie
function postRequestForMovies(id, itemTitle, itemDescription, itemPrice, owned, serverLocation) {
    titleValue = itemTitle.value;
    isOwned = owned;
    descriptionValue = itemDescription.value;
    priceValue = itemPrice.value;
    $.ajax({
        type: 'POST',
        url: serverLocation + "SaveMovie",
        data: { id: id, Title: titleValue, isOwned: isOwned, Description: descriptionValue, Price: priceValue, isActive: true },
        dataType: "text",
        success: function (status) {
            console.log("success");
        },
    });
};

//Delete a movie
function deleteMovie(deleteId, serverLocation) {
    $.ajax({
        type: 'DELETE',
        url: serverLocation + "?id=" + deleteId,
        success: function (status) {
            console.log("success");
        },
        error: function (status, error) {
            console.log(status, error);
        }
    });
};