// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const $ = require('jquery');
const moment = require('moment');
const ct = require('./lib/churchtools');
const credentials = require('./lib/credentials');
const {ipcRenderer, shell} = require('electron');

let isLoggedIn = false;
const fadeTime = 1500;



// logout before window close
ipcRenderer.on('app-close', _ => {

    if (isLoggedIn) {
        const fadeTimeOffset = 300;
        $('#logout-container').fadeIn(fadeTime-fadeTimeOffset);

        ct.logout()
            .then(() => {

                $('#logout h3').fadeIn(fadeTime-fadeTimeOffset, function() {
                    setTimeout(function() {
                        ipcRenderer.send('app-closed');
                    }, 300);
                });

            })
            .catch(() => {
                console.error('logout failed');
            })
    } else {
        ipcRenderer.send('app-closed');
    }

});

$(document).ready( function() {

    $('body').fadeIn(fadeTime);


    $('#login-host, #login-user, #login-pwd').on('input', function() {
        $('#login-host, #login-user, #login-pwd').removeClass('invalid');
    });

    // load saved Login data from storage
    credentials.getLoginData()
        .then(() => {
            const creds = credentials.churchtools;

            $('#login-host').val(removeUrlProtocol(creds.host));
            $('#login-user').val(creds.user);
            $('#login-pwd').val(creds.password);

            if (creds.password) {

                // check switch
                $('#login-store-switch').prop('checked', true);

                if (creds.host && creds.user) {
                    // try auto-login
                    $('#login-submit-button').trigger('click');
                }
            }

        })
        .catch((error) => {
            // TODO: Integrate in user interface (user feedback)
            console.error('getting login data failed:', error);
        });
});


$('#login-submit-button').click(function() {

    let host = $('#login-host').val();
    const user = $('#login-user').val();
    const pwd  = $('#login-pwd' ).val();

    const savePassword = $('#login-store-switch').prop('checked');
    host = checkUrl(host);



    credentials.setLoginData(host, user, pwd, savePassword)
        .then(ct.getEventsOverviewQ)
        .then(function(eventsData) {

            isLoggedIn = true;

            $('#edit-container').fadeIn(fadeTime);
            $('#logout-button-wrapper').fadeIn(fadeTime);
            $('#login-container').slideUp(1000);

            displayEventsList(eventsData);

        })
        .catch(function(error) {
            // TODO: Integrate in user interface (user feedback)

            $('#login-host, #login-user, #login-pwd').addClass('invalid');

            console.error('setting login data failed:', error);
        });
});


$('#login-store-switch').on("click",function() {
    const savePassword = $(this).prop('checked');
    if (!savePassword) {
        credentials.deleteLoginData()
            .catch(() => {
                console.error('deleting password failed');
            })
    }
});


$('#logout-button').on("click", function() {

    ct.logout()
        .then(() => {

            isLoggedIn = false;

            $('#logout-button-wrapper').fadeOut(fadeTime);
            $('#edit-container').fadeOut(fadeTime);
            $('#login-container').slideDown(1000);

        })
        .catch( ()=> {
            console.error('logout failed')
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

function showFactsLoaderIcon() {
    $('#load-facts-icon').css('opacity',0).animate({opacity:1}, 400);
}

function hideFactsLoaderIcon() {
    $('#load-facts-icon').css('opacity',1).animate({opacity:0}, 400);
}


function displayEventsList(eventsData) {

    // empty div
    $('#events-list').empty();

    // convert values
    let edata = [];
    for (let i in eventsData) {
        edata.push({
            id: eventsData[i].id,
            date: moment.utc(eventsData[i].startdate, "YYYY-MM-DD HH:mm:ss"),
            name: eventsData[i].bezeichnung
        })
    }

    // Sort array after date
    edata.sort(function compare(a, b) {
        return a.date - b.date;
    });

    let lastSundayEvent = null;
    for (let j in edata) {
        const _date = edata[j].date;

        // if event is within the last week mark as last passed event
        const diff = moment().diff(_date, 'days');
        if (diff >= 0 && diff < 6) {    // was 0 to 6 days ago
            lastSundayEvent = '#event-'+ edata[j].id;
        }

        const html = `
            <a class='events-list-item collection-item' id='event-${ edata[j].id }'>
                <p><span class='events-list-item-date'>${ _date.format('LL') }</span><br />
                ${ edata[j].name }</p>
            </a>
        `;
        $('#events-list').append(html);
    }

    // select last sundays event
    if (lastSundayEvent != null) {
        $(lastSundayEvent).trigger('click');

        // Scroll to the center of the selected event
        $("#events-list").scrollTop($("#events-list").scrollTop() + $(lastSundayEvent).position().top
            - $("#events-list").height()/2 + $(lastSundayEvent).height()/2);
    }
}

$('body').on('click', '.events-list-item', function() {

    showFactsLoaderIcon();


    $( '.events-list-item' ).each(function() {
        $(this).removeClass("active");
    });
    $(this).addClass("active");

    const eventId = $(this).attr('id').substr(6);
    let factsMetaData;

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
        })
        .finally(hideFactsLoaderIcon);

});

let listOfFactsForEvent = [];
let eventIdOfFacts = '';

function displayFacts(eventId, allFacts, factsMetaData) {

    // empty div
    $('#facts-list').empty();

    eventIdOfFacts = eventId;

    // TODO: Sort names of facts and improve merging
    listOfFactsForEvent = [];
    for (let i in factsMetaData) {
        const f = factsMetaData[i];
        let value = '';

        if (eventId in allFacts) {
            for (let j in allFacts[eventId]) {
                const x = allFacts[eventId][j];
                if (x.fact_id == f.id) {
                    value = x.value;
                    break;
                }
            }
        }
        listOfFactsForEvent.push({ id: f.id, name: f.bezeichnung, sortKey: f.sortkey, value: value });
    }


    for (let i in listOfFactsForEvent) {

        const f = listOfFactsForEvent[i];
        const html = `
            <li class='collection-item facts-list-item row' id='fact-${ f.id }'>
                <div class="fact-description col s6">
                    <h5>${ f.name }</h5>
                </div>
                <div class="input-field inline col s6">
                    <i class="material-icons prefix icon-small">mode_edit</i>
                    <input type="number" value="${f.value}" pattern="\\d+" class="">
                </div>
            </li>
        `;
        $('#facts-list').append(html);
    }
}


$("#submit-facts").click(function() {

    if (eventIdOfFacts === "") return;
    for (let i in listOfFactsForEvent) {

        let fact = listOfFactsForEvent[i];
        let factInputId = '#fact-' + fact.id + ' input';
        let new_value = $(factInputId).val();

        // if value got changed
        if (fact.value != new_value) {

            //console.log(factInputId, ": difference >", fact.value, '<=>', new_value, '<');

            if (new_value === '' || !isNaN(parseFloat(new_value))) {
                ct.setFact(eventIdOfFacts, fact.id, new_value)
                    .then(function () {
                        console.log('fact', fact.id, ' of event', eventIdOfFacts, 'updated from', fact.value, 'to', new_value);
                        fact.value = new_value;
                        M.toast({html: '<i class="material-icons toast-check-icon">check</i><div class="toast-info"> \''+fact.name+'\' reported</div>'});
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

$(".open-github").click(function() {
    shell.openExternal('https://github.com/philipptrenz/churchtools-facts-reporter');
});