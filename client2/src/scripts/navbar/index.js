module.exports =
angular.module('app.navbar', [
	'app.user'
	])
.directive('navbar', function() {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'scripts/navbar/navbar.html',//
    controller: 'NavbarController'
  }
})

require('./navbar_controller');
