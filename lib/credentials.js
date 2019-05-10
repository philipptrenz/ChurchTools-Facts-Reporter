// credentials.js
// stores credentials, must NOT be committed to git!

const {app} = require('electron').remote;

const keytar = require('keytar');
const storage = require('electron-json-storage');

const churchtools = {

  host: '',
  user: '',
  password: ''

};

function setLoginData(host, user, password, savePassword) {
  return new Promise((resolve, reject) => {

    churchtools.host = host;
    churchtools.user = user;
    churchtools.password = password;

    storage.set('login', { host: host, user: user}, function(error) {
      error ? reject(error) : resolve();
    });
  })
  .then(() => {
      if (savePassword) return keytar.setPassword(app.getName(), user, password);
      else return keytar.deletePassword(app.getName(), user);
  });
}

function getLoginData() {
  return new Promise(function (resolve) {
    storage.get('login', function (error, data) {

      churchtools.host = data.host;
      churchtools.user = data.user;

      resolve(data);
    })
  })
  .then(() => {
    return keytar.getPassword(app.getName(), churchtools.user)
  })
  .then((pwd) => {
    churchtools.password = pwd;
  });
}

function deletePassword() {
    return keytar.deletePassword(app.getName(), churchtools.user);
}


// TODO: Not static
module.exports = {

  // to access churchtools via a tool, always use a dedicated tool user in ChurchTools, with limited rights!
  churchtools:  churchtools,
  setLoginData: setLoginData,
  getLoginData: getLoginData,
  deletePassword: deletePassword

};
