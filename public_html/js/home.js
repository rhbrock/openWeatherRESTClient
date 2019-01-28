/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function () {

    $('#getWeatherButton').click(function (event) {

        var hasZipError = validateZip($('#zipUnitsForm').find('input'));
        if (hasZipError) {
            return false;
        }

        $('#showHide').toggle();
        $('#currentConditions').text('');
        var zipCode = $('#zip').val();
        var units = $('#selectUnit').val();

        // Current Weather
        $.ajax({
            type: 'GET',
            url: 'http://api.openweathermap.org/data/2.5/weather?&APPID=0ef23b279c16c4d4d2fe5f01c493c17b&zip='
                    + zipCode + ',us&units=' + units,
            success: function (data) {

                var city = data.name;
                $('#currentConditions').text('Current Conditions in ' + city);
                var currentWeatherImage = data.weather[0].icon;
                var currentWeather = data.weather[0].main;
                var currentWeatherDesc = data.weather[0].description;
                $('#currentWeather').html(
                        '<img src="http://openweathermap.org/img/w/'
                        + currentWeatherImage + '.png" alt="image">')
                        .append(currentWeather + ': ' + currentWeatherDesc);
                var currentTemp;
                var currentWind;
                var currentHumidity = data.main.humidity + "%";
                
                if (units === 'imperial') {
                    currentTemp = data.main.temp + ' F';
                    currentWind = data.wind.speed + ' miles/hour';
                }

                if (units === 'metric') {
                    currentTemp = data.main.temp + ' C';
                    currentWind = data.wind.speed + ' km/hour';
                }

                $('#currentTemp').text('Temperature: ' + currentTemp);
                $('#currentHumidity').text('Humidity: ' + currentHumidity);
                $('#currentWind').text('Wind: ' + currentWind);
            },
            error: function () {
                $('#errorMessages').append($('<li>')
                        .attr({class: 'list-group-item list-group-item-danger'})
                        .text('Error calling web service.  Please try again later.'));
            }

        });

        // 5 Day Weather
        $.ajax({
            type: 'GET',
            url: 'http://api.openweathermap.org/data/2.5/forecast?&APPID=0ef23b279c16c4d4d2fe5f01c493c17b&zip='
                    + zipCode + ',us&units=' + units,
            success: function (data) {

                var divId = 1;

                for (var i = 0; i < 39; i += 8) {
                    var date = new Date(data.list[i].dt_txt);
                    var forcastWeatherImage = data.list[i].weather[0].icon;
                    var weather = data.list[i].weather[0].main;
                    var high = data.list[i].main.temp_max;
                    var low = data.list[i].main.temp_min;
                    
                    var day = date.getDate();
                    var locale = 'en-us';
                    var month = date.toLocaleDateString(locale, {month: 'long'});
                    

                    if (units === 'imperial') {
                        high = data.list[i].main.temp_max + ' F';
                        low = data.list[i].main.temp_min + ' F';
                    }

                    if (units === 'metric') {
                        high = data.list[i].main.temp_max + ' C';
                        low = data.list[i].main.temp_min + ' C';
                    }

                    $('#' + divId).html('<p style>' + day + ' ' + month + '</p>'
                            + '<p> <img src="http://openweathermap.org/img/w/'
                            + forcastWeatherImage + '.png" alt="image">' +
                            weather + '</p>' + '<p> H ' + high + ' L ' + low + '</p>')
                            .css('text-align','center');

                    divId++;
                }

            },
            error: function () {
                $('#errorMessages').append($('<li>')
                        .attr({class: 'list-group-item list-group-item-danger'})
                        .text('Error calling web service.  Please try again later.'));
            }
        });
    });
});

function validateZip(input) {

    $('#errorMessages').empty();
    $('#showHide').hide();
    var errorMessages = [];
    input.each(function () {
        if (!this.validity.valid) {
            var errorField = $('label[for=' + this.id + ']').text();
            errorMessages.push(errorField + ' ' + this.validationMessage);
        }
    });
    if (errorMessages.length > 0) {
        $.each(errorMessages, function (index, message) {
            $('#errorMessages').append($('<li>').attr({class: 'list-group-item list-group-item-danger'}).text(message));
        });
        return true;
    } else {
        return false;
    }
};

