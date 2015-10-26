require('./ioLoader');

module.exports =
angular.module('app.network', [
  'btford.socket-io',
  'app.loader',
  'app.network.websocket'
])
.config(function(ioLoaderProvider) {
  console.log('ioLoader', ioLoaderProvider);
})

require('./socket-io-ws');
require('./players');
require('./feed');

require('./websocket');
