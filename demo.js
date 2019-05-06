// demo.js
// Node.js demo to access resource bookings in ChurchTools
//
// (c) 2017 ChurchTools

var ct = require('./controller/churchtools');
var logger = require('./lib/logger').getLogger({ module: 'demo' });

function getAndPrintAllBookings() {
  ct.getAllBokingsQ()
    .then(function (bookings) {
      console.dir(bookings);
    })
    .fail(function (err) {
      logger.error('CTFR-00', 'failed to get bookings.', {err: err});
    })

}

function getMasterData() {
    ct.getMasterDataQ()
        .then(function (masterData) {
            console.dir(masterData.fact);
        })
        .fail(function (err) {
            logger.error('CTFR-02', 'failed to get factData' +
                '.', {err: err});
        })
}

function getFactData() {
    ct.getMasterDataQ()
        .then(function (masterData) {
            var factData = masterData.fact;
            console.dir(factData);
        })
        .fail(function (err) {
            logger.error('CTFR-02', 'failed to get factData' +
                '.', {err: err});
        })
}

function getEventOverview() {
    ct.getEventsOverviewQ()
    .then(function (events) {
        console.dir(events);
    })
    .fail(function (err) {
        logger.error('CTFR-01', 'failed to get events' +
            '.', {err: err});
    })
}

function getAllFacts() {
    ct.getAllFactsQ()
        .then(function (facts) {
            console.dir(facts);
        })
        .fail(function (err) {
            logger.error('CTFR-02', 'failed to get factData' +
                '.', {err: err});
        })
}

function setFact(eventId, factId, value) {
    ct.setFactQ(eventId, factId, value)
        .then(function () {
            console.dir('setting fact worked');
        })
        .fail(function (err) {
            logger.error('CTFR-02', 'failed to get factData' +
                '.', {err: err});
        })
}




//getAndPrintAllBookings();

//getEventOverview();
//getAllFacts();
//getMasterData();
//getFactData();
//setFact(27, 1, 1337);