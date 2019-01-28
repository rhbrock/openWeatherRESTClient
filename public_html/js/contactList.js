$(document).ready(function () {

    loadContacts();

    $('#add-button').click(function (event) {

        var haveValidationErrors = checkAndDisplayValidationErrors($('#add-form').find('input'));

        if (haveValidationErrors){
            return false;
        }

        $.ajax({
            type: 'POST',
            url: 'http://localhost:8080/contact',
            data: JSON.stringify({
                firstName: $('#add-first-name').val(),
                lastName: $('#add-last-name').val(),
                company: $('#add-company').val(),
                phone: $('#add-email').val(),
                email: $('#add-phone').val()
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            'dataType': 'json',
            success: function () {
                $('errorMessages').empty();
                $('#add-first-name').val(''),
                $('#add-last-name').val(''),
                $('#add-company').val(''),
                $('#add-email').val(''),
                $('#add-phone').val('')

                loadContacts();

            },
            error: function () {
                $('#errorMessages').append($('<li>')
                    .attr({ class: 'list-group-item list-group-item-danger' })
                    .text('Error calling web service.  Please try again later.'));
            }
        })
    });

    $('#edit-button').click(function(event) {

        var haveValidationErrors = checkAndDisplayValidationErrors($('#add-form').find('input'));

        if (haveValidationErrors){
            return false;
        }

        $.ajax({
            type: 'PUT',
            url: 'http://localhost:8080/contact/' + $('#edit-contact-id').val(),
            data: JSON.stringify({
                contactId: $('#edit-contact-id').val(),
                firstName: $('#edit-first-name').val(),
                lastName: $('#edit-last-name').val(),
                company: $('#edit-company').val(),
                phone: $('#edit-email').val(),
                email: $('#edit-phone').val()
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            'dataType': 'json',
            success: function () {
                $('errorMessages').empty();
                hideEditForm();
                loadContacts();
            },
            error: function () {
                $('#errorMessages').append($('<li>')
                    .attr({ class: 'list-group-item list-group-item-danger' })
                    .text('Error calling web service.  Please try again later.'));
            }
        })
    });
});

function loadContacts() {

    clearContactTable();

    var contentRows = $('#contentRows');

    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/contacts',
        success: function (contactArray) {
            $.each(contactArray, function (index, contact) {
                var name = contact.firstName + ' ' + contact.lastName;
                var company = contact.company;
                var contactId = contact.contactId;

                var tableRow = '<tr>';
                tableRow += '<td>' + name + '</td>';
                tableRow += '<td>' + company + '</td>';
                tableRow += '<td><a onclick="showEditForm(' + contactId + ')">Edit</a></td>';
                tableRow += '<td><a onclick="deleteContact(' + contactId + ')">Delete</a></td>';
                tableRow += '</tr>';

                contentRows.append(tableRow);

            });
        },
        error: function() {
            $('#errorMessages').append($('<li>')
                .attr({ class: 'list-group-item list-group-item-danger' })
                .text('Error calling web service.  Please try again later.'));
        }
    });
}

function clearContactTable() {
    $('#contentRows').empty();
}

function showEditForm(contactId) {

    $('#errorMessages').empty();

    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/contact/' + contactId,
        success: function(data, status) {
            $('#edit-first-name').val(data.firstName);
            $('#edit-last-name').val(data.lastName);
            $('#edit-company').val(data.company);
            $('#edit-phone').val(data.phone);
            $('#edit-email').val(data.email);
            $('#edit-contact-id').val(data.contactId);
        },
        error: function() {
            $('#errorMessages')
                .append($('<li>')
                .attr({ class: 'list-group-item list-group-item-danger' })
                .text('Error calling web service.  Please try again later.'));
        }
    })

    $('#contactTableDiv').hide();

    $('#editFormDiv').show();
}

function hideEditForm() {
    $('#errorMessages').empty();

    $('#edit-first-name').val('');
    $('#edit-last-name').val('');
    $('#edit-company').val('');
    $('#edit-phone').val('');
    $('#edit-email').val('');

    $('#editFormDiv').hide();
    $('#contactTableDiv').show();

}

function deleteContact(contactId){
    $.ajax({
        type: "DELETE",
        url: 'http://localhost:8080/contact/' + contactId,
        success: function(){
        loadContacts();
        }
    });

}

function checkAndDisplayValidationErrors(input){
    $('#errorMessages').empty();

    var errorMessages = [];

    input.each(function(){
        if(!this.validity.valid){
            var errorField = $('label[for=' + this.id +']').text();
            errorMessages.push(errorField + ' ' + this.validationMessage);
        }
    });

    if (errorMessages.length > 0){
        $.each(errorMessages, function(index, message){
            $('#errorMessages').append($('<li>').attr({class: 'list-group-item list-group-item-danger'}).text(message));
        });
        return true;

    } else {
        return false;
    }
}




// // processes validation errors for the given input.  returns true if there
// // are validation errors, false otherwise
// function checkAndDisplayValidationErrors(input) {
//     // clear displayed error message if there are any
//     $('#errorMessages').empty();
//     // check for HTML5 validation errors and process/display appropriately
//     // a place to hold error messages
//     var errorMessages = [];

//     // loop through each input and check for validation errors
//     input.each(function() {
//         // Use the HTML5 validation API to find the validation errors
//         if(!this.validity.valid)
//         {
//             var errorField = $('label[for='+this.id+']').text();
//             errorMessages.push(errorField + ' ' + this.validationMessage);
//         }
//     });

//     // put any error messages in the errorMessages div
//     if (errorMessages.length > 0){
//         $.each(errorMessages,function(index,message){
//             $('#errorMessages').append($('<li>').attr({class: 'list-group-item list-group-item-danger'}).text(message));
//         });
//         // return true, indicating that there were errors
//         return true;
//     } else {
//         // return false, indicating that there were no errors
//         return false;
//     }
// }