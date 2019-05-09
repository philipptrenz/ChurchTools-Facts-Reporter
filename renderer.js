// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const $ = require('jquery');
const credentials = require('./lib/credentials');
const ct = require('./controller/churchtools');
const moment = require('moment');

$(document).ready( function() {

    // load saved Login data from storage
    credentials.getLoginData()
        .then(() => {
            const creds = credentials.churchtools;

            $('#login-host').val(removeUrlProtocol(creds.host));
            $('#login-user').val(creds.user);
            $('#login-pwd').val(creds.password);

            if (creds.host !== '' && creds.user !== '' && creds.password !== '') {
                // try auto-login
                $('#login-submit-button').trigger('click');
            }

        })
        .catch((error) => {
            // TODO: Integrate in user interface (user feedback)
            console.error('getting login data failed:', error);
        });
});


$('#login-submit-button').click(function() {

    var host = $('#login-host').val();
    var user = $('#login-user').val();
    var pwd  = $('#login-pwd' ).val();

    host = checkUrl(host);

    credentials.setLoginData(host, user, pwd)
        .then(ct.getEventsOverviewQ)
        .then(function(eventsData) {

            displayEventsList(eventsData);

        })
        .catch(function(error) {

            // TODO: Integrate in user interface (user feedback)
            console.error('setting login data failed:', error);
        });
});

function checkUrl(url) {

    if (url.startsWith("http://")) url = "https" + url.substring(4);
    else if (!url.includes("https://")) url = "https://" + url;

    return url;
}

function removeUrlProtocol(url) {
    return url.startsWith('https://') ? url.substr(8): url;
}

function displayEventsList(eventsData) {

    // empty div
    $('#events-list').empty();

    // convert values
    var edata = [];
    for (let i in eventsData) {
        edata.push({ id: eventsData[i].id, date: moment.utc(eventsData[i].startdate, "YYYY-MM-DD HH:mm:ss"), name: eventsData[i].bezeichnung })
    }

    // Sort array after date
    edata.sort(function compare(a, b) {
        return a.date - b.date;
    });

    for (let j in edata) {
        const html = `
            <div class='events-list-item' id='event-${ edata[j].id }'>
                <p>${ edata[j].date.format('LL') }:  ${ edata[j].name }</p>
            </div>
        `;
        $('#events-list').append(html);
    }
}

$('body').on('click', '.events-list-item', function() {

    // reset all colors and then color current light
    $( '.events-list-item' ).each(function() {
        $(this).css('background-color', 'darkgray');
    });
    $(this).css('background-color', 'lightgray');

    var eventId = $(this).attr('id').substr(6);
    var factsMetaData;

    ct.getMasterData()
        .then(function(masterData) {
            factsMetaData = masterData.fact;
            return ct.getAllFacts();
        })
        .then( function(allFacts) {
            displayFacts(eventId, allFacts, factsMetaData);
        })
        .fail(function(error) {

            // TODO: Integrate in user interface (user feedback)
            console.log('An error occured while retrieving facts:', error);
        });

});

var listOfFactsForEvent = [];
var eventIdOfFacts = '';

function displayFacts(eventId, allFacts, factsMetaData) {

    // empty div
    $('#facts-list').empty();

    eventIdOfFacts = eventId;

    // TODO: Sort names of facts and improve merging
    listOfFactsForEvent = [];
    for (var i in factsMetaData) {
        var f = factsMetaData[i];
        var value = '';

        if (eventId in allFacts) {
            for (var j in allFacts[eventId]) {
                var x = allFacts[eventId][j];
                if (x.fact_id == f.id) {
                    value = x.value;
                    break;
                }
            }
        }
        listOfFactsForEvent.push({ id: f.id, name: f.bezeichnung, sortKey: f.sortkey, value: value });
    }


    for (var i in listOfFactsForEvent) {

        var f = listOfFactsForEvent[i];
        var html = `
            <div class='facts-list-item' id='fact-${ f.id }'>
                ${ f.name }: <input type="number" value="${ f.value }" pattern="\\d+"></input>
            </div>
        `;
        $('#facts-list').append(html);

    }
}


$("#submit-facts").click(function() {

    if (eventIdOfFacts === "") return;
    for (i in listOfFactsForEvent) {

        var fact = listOfFactsForEvent[i];
        var factInputId = '#fact-' + fact.id + ' input';
        var new_value = $(factInputId).val();

        // if value got changed
        if (fact.value != new_value) {

            console.log("difference >", fact.value, '<=>', new_value, '<');

            if (new_value === '' || !isNaN(parseFloat(new_value))) {
                ct.setFact(eventIdOfFacts, fact.id, new_value)
                    .then(function () {
                        console.log('fact', fact.id, ' of event', eventIdOfFacts, 'updated from', fact.value, 'to', new_value);
                        fact.value = new_value;
                    })
                    .fail(function (error) {

                        // TODO: Integrate in user interface (user feedback)
                        console.error('Updating fact', fact.id, 'failed:', error);
                    });
            } else {
                // TODO: Integrate in user interface (user feedback)
                console.error(new_value, 'is not parsable to float, not sending new fact value')
            }
        }
    }
});