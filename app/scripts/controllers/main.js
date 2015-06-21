'use strict';

angular.module('mommodApp')
    .controller('MainCtrl', [
        '$scope', '$rootScope', '$location',
        function ($scope, $rootScope, $location) {
            if ($rootScope.currentUser) {
                $location.path('list');
            }

            $scope.tab = 0;

            $scope.user = {
                username: '',
                email: '',
                password: ''
            };
            $scope.error = {};

            $scope.signIn = function () {
                Parse.User.logIn($scope.user.username, $scope.user.password)
                    .done(function (user) {
                        $scope.$apply(function () {
                            $rootScope.currentUser = user;
                            $location.path('list');
                            $rootScope.alert = {
                                type: 'success',
                                message: 'Successfully signed in.',
                                path: $location.path()
                            };
                        });
                    })
                    .fail(function (error) {
                        console.log(error);
                        $scope.$apply(function () {
                            $rootScope.alert = {
                                type: 'danger',
                                message: '[' + error.code + '] ' + error.message,
                                path: $location.path()
                            };
                        });
                    })
                ;
            };

            $scope.signUp = function () {
                var user = new Parse.User();
                user
                    .set('username', $scope.user.username)
                    .set('email', $scope.user.email)
                    .set('password', $scope.user.password)
                    .signUp()
                    .then(function (user) {
                        $scope.$apply(function () {
                            $rootScope.currentUser = user;
                            $location.path('list');
                            $rootScope.alert = {
                                type: 'success',
                                message: 'Successfully signed up.',
                                path: $location.path()
                            };
                        });
                    })
                    .fail(function (error) {
                        $scope.$apply(function () {
                            $rootScope.alert = {
                                type: 'danger',
                                message: '[' + error.code + '] ' + error.message,
                                path: $location.path()
                            };
                        });
                    })
                ;
            };
        }
    ])
;
