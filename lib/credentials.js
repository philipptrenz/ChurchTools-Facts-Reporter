// credentials.js
// stores credentials, must NOT be committed to git!
const {ipcRenderer} = require('electron');
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
      if (savePassword) return setPassword(user, password);
      else return deletePassword()
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
    return getPassword();
  })
  .then((pwd) => {
    churchtools.password = pwd;
  });
}

function deleteLoginData() {
  return new Promise(function (resolve) {
    const res = deletePassword(churchtools.user);
    resolve(res);
  });
}

function getPassword() {
  return new Promise((resolve, reject) => {
    const res = ipcRenderer.sendSync('get-password', churchtools.user);
    resolve(res);
  })
}

function setPassword(user, password) {
  return new Promise((resolve, reject) => {
    const res = ipcRenderer.sendSync('set-password', user, password);
    resolve(res);
  });
}

function deletePassword(user) {
  return new Promise((resolve, reject) => {
    const res = ipcRenderer.sendSync('delete-password', churchtools.user);
    resolve(res);
  })

}


// TODO: Not static
module.exports = {

  // to access churchtools via a tool, always use a dedicated tool user in ChurchTools, with limited rights!
  churchtools:  churchtools,
  setLoginData: setLoginData,
  getLoginData: getLoginData,
  deleteLoginData: deleteLoginData

};
