// Data Validation

// only run when DOM is loaded
$(document).ready(function () {

    $("form[id='content']").submit(function () {

        // Full Name
        var fullname = $('input[id="fullname"]').val();
        var phonenumber = $('input[id="mobile"]').val();
        var address = $('input[id="address"]').val();
        var postal = $('input[id="postal"]').val();
        var deliverdate = $('input[id="deliverdate"]').val();
        var delivertime = $('select[id="delivertime"]').val();
        var paymentmethod = $('input[name="payment"]:checked').val();
        var comments = $('textarea[name="comments"]').val();
  
        console.log(fullname, phonenumber, address, postal, deliverdate, delivertime, paymentmethod, comments);

        // Since we will repeat the hiding and showing of error messages throughout, might as well put them in a function.
        // The first function showErrorMessage() stops hiding the error message (by default display: none) and to show it.
        // The second function hideErrorMessage() hides the error message back when no errors are detected.
        function showErrorMessage(targetelement) {
            targetelement.addClass('error_show').removeClass('error_hide');
        }

        function hideErrorMessage(targetelement) {
            targetelement.addClass('error_hide').removeClass('error_show');
        }

        // I would love to put the below into a function since they are more or less similar, but since each field has different
        // validation criteria, I did not. But if I were merely just finding out if they were empty, this could have been done.

        // Full Name Validation
        var fullname_errormsg = $('div[id="fullname_errormsg"]');
        if ((fullname == '') || (/\d/.test(fullname))) { // if empty or if contains digits, show error message
            showErrorMessage(fullname_errormsg);
        } else {
            hideErrorMessage(fullname_errormsg);
        }

        // Phone Number Validation
        var mobile_errormsg = $('div[id="mobile_errormsg"]');
        if ((phonenumber == '') || !(phonenumber.match(/^\d{8}$/))) { // if contains anything other than digits or not 8 digits, show error message
            showErrorMessage(mobile_errormsg);
        } else {
            hideErrorMessage(mobile_errormsg);
        }

        // Address Validation
        var address_errormsg = $('div[id="address_errormsg"]');
        if (address == '') { // if address is empty
            showErrorMessage(address_errormsg);
        } else {
            hideErrorMessage(address_errormsg);
        }

        // Postal Code Validation
        var postal_errormsg = $('div[id="postal_errormsg"]');
        if ((postal == '') || !(postal.match(/^\d{6}$/))) { // if contains anything other than digits or not 6 digits, show error message
            showErrorMessage(postal_errormsg);
        } else {
            hideErrorMessage(postal_errormsg);
        }

        // Delivery Date Validation
        var deliverdate_errormsg = $('div[id="deliverdate_errormsg"]');
        var now_date = new Date();
        var today_YYYYMMDD = now_date.getFullYear() + '-' + ('0' + (now_date.getMonth() + 1)).slice(-2) + '-' + ('0' + now_date.getDate()).slice(-2);
        if ((deliverdate == '') || (deliverdate <= today_YYYYMMDD)) { // if delivery date is not chosen or is not in the future
            showErrorMessage(deliverdate_errormsg);
        } else {
            hideErrorMessage(deliverdate_errormsg);
        }

        // Payment Method Validation
        var payment_errormsg = $('div[id="payment_errormsg"]');
        if (paymentmethod == undefined) {
            showErrorMessage(payment_errormsg);
        } else {
            hideErrorMessage(payment_errormsg);
        }

        // If no more errors, submit. If still have errors, block submission.
        var all_spans = $('div').toArray(); // we do this so we can loop through this array
        var to_return = true;
        all_spans.forEach((indiv_span) => {
            // console.log(indiv_span.className);
            if (indiv_span.className == 'error_show') { // if any of the div elements's class is still error_show (aka there are errors), we will return false at the end
                to_return = false;
            }
        });
        return to_return;


    });

});