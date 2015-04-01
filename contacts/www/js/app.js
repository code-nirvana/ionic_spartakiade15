// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('spartaContacts', ['ionic', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider




    .state('contacts', {
      url: "/contacts",
      templateUrl: "templates/contacts/contactList.html",
      controller: 'ContactsCtrl'
    })

    .state('contactDetails', {
      url: "/contacts/:contactId",
      templateUrl: "templates/contacts/contactDetails.html",
      controller: 'ContactDetailsCtrl'
    })


    $urlRouterProvider.otherwise('/contacts');
})

.controller('ContactsCtrl', function($scope, Contacts, $ionicModal) {

  var loadContacts = function () {
    Contacts.all().then(function (contacts) {
      $scope.contacts = contacts;
    })
  };

  loadContacts();

  $scope.remove = function(contact) {
    Contacts.remove(contact);
  };

  $ionicModal.fromTemplateUrl('templates/contacts/contactNewEdit.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.contactNewEditModal = modal;
  });

  $scope.addContact = function () {
    $scope.contactNewEditModal.show();
  };

  $scope.$on('modal.hidden', function() {
    loadContacts();
  });
})

.controller('ContactDetailsCtrl', function ($scope, $stateParams, Contacts) {
  $scope.contact = Contacts.get($stateParams.contactId);
})

.controller('ContactNewEditCtrl', function ($scope, Contacts, $cordovaCamera, $cordovaDialogs) {

  $scope.contact = {};

  $scope.takePicture = function () {

    var options = {
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      targetWidth: 300,
      targetHeight: 200
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {

      $scope.contact.face = "data:image/jpeg;base64," + imageData;

      var image = document.getElementById('face');
      image.src = $scope.contact.face;

    }, function() {
      $cordovaDialogs.alert('... but there\'s no camera available', 'I am sorry...');
    });

  };

  $scope.abort = function() {
    $scope.contactNewEditModal.hide();
  };

  $scope.apply = function() {
    Contacts.add($scope.contact);
    $scope.contactNewEditModal.hide();
  }

})

.factory('Contacts', function ($q, $http, $timeout) {

  var contacts = [{
    id: 0,
    firstName: 'Ben',
    lastName: 'Sparrow',
    metAt: 'ngConf 2015',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    firstName: 'Max',
    lastName: 'Lynx',
    metAt: 'ngConf 2015',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    firstName: 'Andrew',
    lastName: 'Jostlin',
    metAt: 'ngConf 2015',
    face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
  }, {
    id: 3,
    firstName: 'Adam',
    lastName: 'Bradleyson',
    metAt: 'ngConf 2015',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 4,
    firstName: 'Perry',
    lastName: 'Governor',
    metAt: 'ngConf 2015',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }];

  return {
    all: function() {
      //return contacts;

      var deferred = $q.defer();

      $timeout(function () {

        //deferred.resolve(contacts);

        $http.get('http://localhost:12345/contacts').then(function (res) {

          contacts = res.data;

          deferred.resolve(contacts);
        })

      });

      return deferred.promise;



    },
    add: function (contact) {
      contact.id = contacts.length + 1;
      contacts.push(contact);
    },
    remove: function(contact) {
      contacts.splice(contacts.indexOf(contact), 1);
    },
    get: function(contactId) {
      for (var i = 0; i < contacts.length; i++) {
        if (contacts[i].id === parseInt(contactId)) {
          return contacts[i];
        }
      }
      return null;
    }
  };
})

;
