// credentials.js
// stores credentials, must NOT be committed to git!

var storage = require('electron-json-storage');

var churchtools = {

  host: '',
  user: '',
  password: ''

};

function setLoginData(host, user, password, doSavePassword) {

  return new Promise(function (resolve, reject) {

    churchtools.host = host;
    churchtools.user = user;
    churchtools.password = password;

    var pwd = doSavePassword ? password : '';

    storage.set('login', { host: host, user: user, password: pwd }, function(error) {
      
      if (error) reject(error);
      else resolve();

    });
  });
}

function getLoginData() {
  return new Promise(function (resolve, reject) {

    storage.get('login', function (error, data) {

      churchtools.host = data.host;
      churchtools.user = data.user;
      churchtools.password = data.password;

      resolve(data);
    })
  });
}


// TODO: Not static
module.exports = {

  // to access churchtools via a tool, always use a dedicated tool user in ChurchTools, with limited rights!
  churchtools:  churchtools,
  setLoginData: setLoginData,
  getLoginData: getLoginData

};
