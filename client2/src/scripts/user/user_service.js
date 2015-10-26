angular.module('app.user')
.service('User', function(mySocket) {
  var UUID = require('../game/lib/uuid');
  var currentUser =
    localStorage.getItem('currentUser');

  if (currentUser) {
    currentUser = JSON.parse(currentUser);
  };

  this.setCurrentUser = function(u) {
    if (!u.guid) {
      u.guid = UUID.v4();
    }
    localStorage.setItem('currentUser', JSON.stringify(u));
    currentUser = u;
    //mySocket.emit('setPlayerName', u);
  };

  this.getCurrentUser = function() {
    if (!currentUser || !currentUser.username ) {
       return {
        username: ''
       }
    }
    return currentUser;
  };

  this.modifyCurrentUser = function(opts) {
    var u = this.getCurrentUser();

    if (u) {
      for (var opt in opts) {
        u[opt] = opts[opt];
      }
      this.setCurrentUser(u);
    } else {
      this.setCurrentUser(opts);
    }

    return currentUser;
  };

});
