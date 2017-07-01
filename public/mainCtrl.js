angular.module('app').controller('mainCtrl',function($scope, mainSvc){

  $scope.selected = -1

  $scope.currentUser = '';
  $scope.showInputField = 0;
  $scope.changePasswordError = ''
  $scope.passChangedSuccess = ''

  var clearform = function() {
    $scope.userInput = ''
    $scope.login_email = ''
    $scope.login_password = ''
    $scope.email = ''
    $scope.password = ''
    $scope.oldPassField = ''
    $scope.passChangeField = ''
    $scope.passChangeFieldRepeat = ''
    $scope.showInputField = 0
  }

  $scope.submit = function(userInput){
    mainSvc.submit(userInput).then(function(){
        $scope.seeNames()
        clearform();

    })
  }
  $scope.enter = function(e){
    if(e.keyCode === 13){
      $scope.submit($scope.userInput)
    }
  }
  $scope.seeNames = function(){
      mainSvc.seeNames().then(function(response){
      $scope.names = response.data;
    })  
  }
  $scope.seeNames()

  $scope.remove = function(id){
    mainSvc.removeName(id).then(function(){
        $scope.seeNames()
    })
  }

  $scope.edit = function(id){
    ($scope.selected === id ? $scope.selected = -1 : $scope.selected = id)
    
  }
  $scope.update = function(newObj){
    mainSvc.updateName(newObj).then(function(){
        $scope.seeNames()
        $scope.selected = -1
      })
  }
  $scope.newUser = function(userObj) {
    mainSvc.checkUser(userObj).then(function(response){
      if (!response.data[0] || response.data[0].email != userObj.email) {
        mainSvc.newUser(userObj)
        clearform();
      }
      else {
        $scope.iflogged = "Sorry but that email is already being used"
        clearform()
      }
    })
  }

  var seeUser = function() {
    mainSvc.seeUser().then(function(response) {
      $scope.currentUser = response.data;
      if ($scope.currentUser) {
        $scope.iflogged = "Logged in "
      }
      else {
        $scope.iflogged = ""
      }
    })
  }
  seeUser();
  

  $scope.checkUser = function(obj) {
    mainSvc.checkUser(obj).then(function(response){
      if (response.data[0]) {
        $scope.seeNames()
        $scope.currentUser = response.data[0].email;
        $scope.iflogged = "Logged in "
        clearform()
      }
      else {
        $scope.iflogged = "Sorry, that is all wrong"
        $scope.currentUser = null;
      }
      
    })
  }

  //changePassword is a the input fields for changing password that when showInputField is not false then it will show the input fields
  $scope.changePassword = function() {
    $scope.showInputField = 5;
  }

  //submitNewPassword is a function that checks if the new password and repeat new password are identical. If so it sends the service the object
  $scope.submitNewPassword = function(obj) {
    if (obj.newPass === obj.newPassVerify) {
      mainSvc.changePassword(obj);
      $scope.passChangedSuccess = 'Your password has been updated'
      // setTimeout(clearPassChangedSuccess(), 3000);
    }
    else {
      $scope.changePasswordError = 'Sorry your passwords do not match'
    }
    clearform()
  }
  var clearPassChangedSuccess = function() {
    $scope.passChangedSuccess = ''
  }

  $scope.logout = function(){
    mainSvc.logout()
    seeUser()

  }
  
})
