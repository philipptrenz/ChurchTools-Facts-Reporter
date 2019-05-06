// churchtools.js
// defines API calls to ChurchTools
//
// (c) 2017 ChurchTools

var ctaccessor = require('../lib/ctaccessor');
var credentials = require('../credentials');

var loginQ = function () {
  return ctaccessor.postQ('login/ajax', {
    func: 'login',
    email: credentials.churchtools.user,
    password: credentials.churchtools.password
  });
};

// ----------- churchresource -----------

var getResourceBookingsQ = function () {
  return ctaccessor.postQ('churchresource/ajax', {
    func: 'getBookings'
  });
};

var getAllBookingsQ = function () {
  // login
  return loginQ()
      .then(function () {
        // read the master data => Groups
        return getResourceBookingsQ();
      });
};

// ----------- churchservice -----------

var getMasterData = function () {
  return ctaccessor.postQ('churchservice/ajax', {
    func: 'getMasterData'
  });
};

var getAllEventData = function () {
  return ctaccessor.postQ('churchservice/ajax', {
    func: 'getAllEventData'
  });
};

var getAllFacts = function () {
  return ctaccessor.postQ('churchservice/ajax', {
    func: 'getAllFacts'
  });
};

var setFact = function (eventId, factId, value) {
  return ctaccessor.postQ('churchservice/ajax', {
    func: 'saveFact',
    event_id: String(eventId),
    fact_id: String(factId),
    value: String(value)
  });
};

var getMasterDataQ = function () {
  // login
  return loginQ()
      .then(function () {
        return getMasterData();
      });
};

var getEventsOverviewQ = function () {
  // login
  return loginQ()
      .then(function () {
        return getAllEventData();
      });
};

var getAllFactsQ = function () {
  // login
  return loginQ()
      .then(function () {
        return getAllFacts();
      });
};

var setFactQ = function (eventId, factId, value) {
  // login
  return loginQ()
      .then(function () {
        return setFact(eventId, factId, value);
      });
};


module.exports = {
  getAllBookingsQ: getAllBookingsQ,
  getMasterDataQ: getMasterDataQ,
  getEventsOverviewQ: getEventsOverviewQ,
  getAllFactsQ: getAllFactsQ,
  setFactQ: setFactQ
};