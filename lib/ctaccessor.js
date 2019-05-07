// ctaccessor.js
// helper function to access ChurchTools API
//
// (c) 2017 ChurchTools

var credentials = require('./credentials');
var logger = require('../lib/logger').getLogger({ module: 'lib/ctaccessor' });
var rest = require('restler');
var Q = require('q');
var _ = require('underscore');

var cookieStore = {};


var postQ = function (q, data, contentType, multipart, retry) {
  // FIXME: check here, if we should abort

  var deferred = Q.defer();

  var cookies = _.map(cookieStore, function(val, key) {
    return key + "=" + encodeURIComponent(val);
  }).join("; ");

  var url = credentials.churchtools.host + '/?q='+q;
  logger.debug('74AB9450-438F-4476-93E6-3EC251539EB1', (retry?'Retry: ':'')+'Calling CT API '+q+' '+JSON.stringify(data.func)+' ...');
  rest.post(url, {
    multipart: multipart,
    headers: {
      Cookie: cookies,
      'Content-Type': contentType
    },
    data: data
  }).on("complete", function(result, res) {
    data.password = undefined;

    if (!res) {
      // no response, e.g. due to ENOTFOUND error in getaddrinfo system call
      logger.debug('E6C427A6-D45B-4610-A0EB-36317B138D13', 'Response from CT call '+q+' '+JSON.stringify(data.func)+' : no response!', {result: result});
      var thenable = Q(true)
        .delay(1000) // wait one second, then try again
        .then(function () {
          // FIXME: check here, if we should abort instead of trying again
          return postQ(q, data, contentType, multipart, true);
        });
      deferred.resolve(thenable);
      return;
    }

    logger.debug('4FDE9C12-A090-49ED-993C-D723D5EB2CDE', 'Response from CT call '+q+' '+JSON.stringify(data.func)+' : '+res.statusCode);

    if (res.headers && res.headers["set-cookie"]) {
      var newcookies = res.headers["set-cookie"];
      _.each(newcookies, function (newcookie) {
        var keyvalue = newcookie.split(";")[0].split("=");
        var key = keyvalue[0];
        var value = keyvalue[1];
        if (value.indexOf('deleted') === 0) {
          logger.debug('9D0C9576-C0A5-43F9-8222-38D4F3750F3F', 'Deleted cookie: '+key);
          cookieStore[key] = undefined;
        } else {
          if (cookieStore[key] != value) {
            logger.debug('B24CED24-F24A-478A-B709-1473749A9EF1', 'Found new cookie: ' + key + '=' + value);
            cookieStore[key] = value;
          }
        }
      });
    }

    if (result && ((result.status == 'success') ||
      ((typeof result == 'string') && (result.substr(0,8) == '{"files"')))) {
      if ((result.status == 'success') && result.data) {
        remove_encoding(result.data, true);
      }
      deferred.resolve(result.data);
    } else {
      deferred.reject({message: 'Call to CT, '+q+' '+JSON.stringify(data.func)+', failed: '+(result ? JSON.stringify(result) : 'no result')});
    }
  }).on('timeout', function () {
    logger.debug('54CBEDCB-204B-4AA7-8D13-610C0E31DBA3', 'Timeout at CT call ' + q + ' ' + JSON.stringify(data.func) + ' !');
    var thenable = Q(true)
      .delay(1000) // wait one second, then try again
      .then(function () {
        // FIXME: check here, if we should abort instead of trying again
        return postQ(q, data, contentType, multipart, true);
      });
    deferred.resolve(thenable);
  });

  return deferred.promise;
};

function remove_encoding(obj, recurse) {
  for (var i in obj) {
    if (typeof obj[i] === 'string') {
      obj[i] = obj[i].split('&quot;').join('"');
    } else if (recurse && typeof obj[i] === 'object') {
      remove_encoding(obj[i], recurse);
    }
  }
}

var postMultipartQ = function (q, data, contentType) {
  return postQ(q, data, contentType, true);
};

module.exports = {
  postQ: postQ,
  postMultipartQ: postMultipartQ
};
