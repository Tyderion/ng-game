angular.module('app.network')
.factory('mySocket', function(ioLoader, $q, socketFactory, User) {

  var mySocket = $q.defer();
  console.log("socket")
  ioLoader.done().then(function(io) {
  	console.log('socket using ' + window.location.hostname);
    var myIoSocket = io.connect(window.location.hostname + ":" + window.location.port);

    var aSock = socketFactory({
      ioSocket: myIoSocket
    });

    mySocket.resolve(aSock);
  });

  return mySocket.promise;
});
