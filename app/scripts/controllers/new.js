'use strict';

angular.module('mommodApp')
    .controller('NewCtrl', [
        '$scope', '$rootScope', '$location', '$timeout', 'assertSignedIn',
        function ($scope, $rootScope, $location, $timeout, assertSignedIn) {

            assertSignedIn();

            $scope.title = '';
            $scope.content = '';

            $scope.createTopic = function () {
                var acl = new Parse.ACL();
                acl.setPublicReadAccess(false);
                acl.setPublicWriteAccess(false);
                acl.setReadAccess($rootScope.currentUser.id, true);
                acl.setWriteAccess($rootScope.currentUser.id, true);

                var topic = new Parse.Object('Topic');
                topic
                    .set('title', $scope.title)
                    .set('content', $scope.content)
                    .set('user', $rootScope.currentUser)
                    .setACL(acl)
                    .save()
                    .done(function (topic) {
                        $location.path('topic/' + topic.id);
                        $rootScope.alert = {
                            type: 'success',
                            message: 'Topic is successfully created.',
                            path: $location.path()
                        };
                        $timeout();
                    })
                    .fail(function (error) {
                        $rootScope.alert = {
                            type: 'danger',
                            message: '[' + error.code + '] ' + error.message,
                            path: $location.path()
                        };
                        $timeout();
                    })
                ;
            };
        }
    ])
;
