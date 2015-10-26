angular.module('app.network.websocket', ['ngWebsocket'])
.factory('webSocket', function($injector) {
  // Why the fuck do I need to not inject this normally???
  var $websocket = $injector.get('$websocket');
    console.log('webSocket initialized');
        var ws = $websocket.$new('ws://localhost:8000'); // instance of ngWebsocket, handled by $websocket service
        ws.$on('$open', function() {
            console.log('Oh my gosh, websocket is really open! Fukken awesome!');

            ws.$emit('ping', 'hi listening websocket server'); // send a message to the websocket server

            var data = {
                level: 1,
                text: 'ngWebsocket rocks!',
                array: ['one', 'two', 'three'],
                nested: {
                    level: 2,
                    deeper: [{
                        hell: 'yeah'
                    }, {
                        so: 'good'
                    }]
                }
            };

            ws.$emit('pong', data);
        });
        return {
          on: ws.$on.bind(ws)
        }
    });
