// for the SW PWA part
if (!('serviceWorker' in navigator)){
    console.log("Service Worker not supported.");
    } else {
    navigator.serviceWorker.register("./service-worker.js")
    .then(function(reg){
        console.log("Registered Service Worker.", reg);
    })
    .catch(function(err){
        console.log("Failure in Registering Service Worker.", err);
    });
} 

// for the AJAX part
function submitAJAXrequest() {
    $.ajax({
        url: '../hostedlistingdata.json',
        type: 'GET',
        dataType: 'json', // data type that comes back
        success: successFunction, // function that runs when success. Note that since no (), means you are NOT calling the function. You are just saying the name of the JS function to be called.
        error: errorFunction, // function that runs when failure
    });
    return false;
}

var calledbefore; // this is to prevent the successFunction from running more than once

function successFunction(result) {

    if (calledbefore == true) {
        return
    }

    parsed = JSON.parse(JSON.stringify(result)); // just to show that most of the times we may need to JSON.parse() strings to get back the JS object. for some reason, don't need here.
    calledbefore = true; // this is to prevent the successFunction from running more than once
    // to display each item
    let stringtoadd;
    Object.entries(parsed).forEach(ele => {
        values = ele[1]; // because you just want the value part from each line of object-array
        var img = document.createElement('img'); // create an <img> element to retrieve picture
        img.src = values["imageurl"];
        stringtoadd =   `<tr>
                            <th scope="col">` + values["id"] + `</th>
                            <td id="img` + values["id"] +`"></td>
                            <td>` + values["name"] + `</td>
                            <td>` + values["price"] + `</td>
                        </tr>`;
        td_to_add_img = '#img' + values["id"];
        $('#tablelisting').append(stringtoadd);
        $(`${td_to_add_img}`).append(img)

        // for each item, store in localstorage so that once you made the ajax call to retrieve the data, you can always re-access it even if after closing the browser (if never clear)
        window.localStorage.setItem(ele[1]["id"], JSON.stringify(ele[1]));
        console.log(JSON.parse(window.localStorage.getItem(ele[1]["id"])));
    });

    $('#tablelisting').on('click', evt => {
        clicked_row = evt.target.parentNode; // to get the entire row so you know which row got clicked
        console.log(clicked_row);
        if ($(clicked_row).find("th").html()) {
            clicked_row = $(clicked_row).find("th").html(); // get the clicked row's number
        } else {
            clicked_row = $(clicked_row).attr("id").slice(-1); // if click on image, have to do this way to get row number
        }
        console.log(clicked_row); 
        window.sessionStorage.setItem('number', clicked_row); // we store the clicked row's number using sessionStorage because it's not useful after the browser closes. so just a very temporary data storage.
        window.open("./detailsWMDPWA.html");
    });
}

function errorFunction(xhr, status, strErr) {
    console.log('error')
    $('#tablelisting').html('<p>An error has occurred</p>');
}

// function to save the notes entered in the details page
function saveNotes() {
    old_obj = JSON.parse(window.localStorage.getItem(window.sessionStorage.getItem('number')));
    old_obj.savednotes = $(".textarea").val();
    console.log(old_obj)
    window.localStorage.setItem(old_obj["id"], JSON.stringify(old_obj));
}

//// all the above are either for SW or function definitions
//// all the below are the actual calling of the above defined functions

$(function() { // have to do this method because can only generate listing after DOM is loaded and ready
    $("#generatebtn").on('click', submitAJAXrequest);
});

$(function() { // add a listener to the details page's notes textarea
    $("#savenotes").on('click', saveNotes);
});

// this function is to retrieve what row was clicked for the Details page
$(function() { 
    clicked_obj = JSON.parse(window.localStorage.getItem(window.sessionStorage.getItem('number')));
    console.log(clicked_obj)
    var img = document.createElement('img');
    img.src = clicked_obj["imageurl"];
    stringtoadd =   `<tr>
                        <th scope="col">` + clicked_obj["id"] + `</th>
                        <td id="img` + clicked_obj["id"] +`"></td>
                        <td>` + clicked_obj["name"] + `</td>
                        <td>` + clicked_obj["price"] + `</td>
                    </tr>`;
    td_to_add_img = '#img' + clicked_obj["id"];
    $('#details').append(stringtoadd);
    $(`${td_to_add_img}`).append(img);

    if (clicked_obj["savednotes"]) {
        $(".textarea").html(clicked_obj["savednotes"]);
    }
});