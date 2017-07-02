angular.module('app').controller('mainCtrl',function($scope, mainSvc){

    $scope.editButtonName = 'Edit'
    $scope.currentUser = $scope.currentUser || ''
    $scope.changePasswordmessageInfo = ''
    $scope.passChangedSuccess = ''
    $scope.userFirstname = $scope.userFirstname || ''
    $scope.selected = -1
    $scope.showInputField = 0
    $scope.myFriends = ''

    const clearform = function() {
        $scope.userInput = ''
        $scope.login_email = ''
        $scope.login_password = ''
        $scope.email = ''
        $scope.password = ''
        $scope.oldPassField = ''
        $scope.passChangeField = ''
        $scope.passChangeFieldRepeat = ''
        $scope.createName = ''
        $scope.passwordVerify = ''
        $scope.showInputField = 0
    }

    $scope.submit = function(userInput){
        mainSvc.submit(userInput).then(function(){
            $scope.seeItems()
            clearform()
        })
    }

    $scope.seeItems = function(){
        mainSvc.seeItems().then(function(response){
            $scope.items = response.data
            // setTimeout($scope.seeItems(), 5000)
        })  
        setTimeout(function() {
            $scope.seeItems() 
            console.log('hello')
        }
            , 10000)
    }
    $scope.seeItems()
    

    $scope.removeItem = function(id){
        var r = confirm("Are you sure you want to delete this item?");
        if (r == true) {
            mainSvc.removeItem(id).then(function(){
            $scope.seeItems()
            })
        } 
    }

    $scope.edit = function(id){
        ($scope.selected === id ? $scope.selected = -1 : $scope.selected = id)
    }

    $scope.updateItem = function(newObj){
        mainSvc.updateItem(newObj).then(function(){
            $scope.seeItems()
            $scope.selected = -1
        })
    }

    $scope.newUser = function(userObj) {
        if (userObj.password !== userObj.passwordVerify){
            alert('Your password did not match');
            clearform()
        }
        else {
            mainSvc.checkUser(userObj).then(function(response){
                console.log(response.data)
                if (!response.data[0] || response.data[0].email != userObj.email) {
                    mainSvc.newUser(userObj)
                    clearform()
                    $scope.messageInfo = 'Your account has been created!'
                }
                else {
                    alert("Sorry but that email is already being used")
                    clearform()
                }
            })
        }
    }

    var seeUser = function() {
        mainSvc.seeUser().then(function(response) {
            $scope.currentUser = response.data
            $scope.currentUser ? $scope.messageInfo = "Logged in." : $scope.messageInfo = ""
            getName()
            // seeMyFriends()
        })
    }

    seeUser();

    var getName = function() {
        mainSvc.getName().then(function(response) {
            if(response.data[0]) {
                $scope.userFirstname = response.data[0].firstname
            }
        })
    }
  

    $scope.checkUser = function(obj) {
        mainSvc.checkUser(obj).then(function(response){
            if (!response.data[0]) {
                alert("Sorry, that is all wrong")
                $scope.currentUser = null
            }
            else {
                $scope.seeItems()
                $scope.currentUser = response.data[0].email
                $scope.messageInfo = "Logged in."
                clearform()
                getName()
                seeMyFriends()
            }
        })
    }

    //changePassword is a the input fields for changing password that when showInputField is not false then it will show the input fields
    $scope.changePassword = function() {
        $scope.showInputField = 5
    }

    //submitNewPassword is a function that checks if the new password and repeat new password are identical. If so it sends the service the object
    $scope.submitNewPassword = function(obj) {
        if (obj.newPass === obj.newPassVerify) {
            mainSvc.changePassword(obj).then(function(response) {
                 if (response.data === 'error') {
                     alert('Your password is incorrect')
                     $scope.oldPassField = ''
                     return;
                 }
                 else {
                    alert('Your password has been updated')
                    $scope.messageInfo = 'Logged in'
                    clearform()
                 }
            })
        }
        else {
            alert('Sorry your passwords do not match')
        }
    }

    $scope.addFriend = function(obj) {
        mainSvc.addFriend(obj).then(function(response) {
            if (response.data !== 'error') {
                $scope.seeItems()
                seeMyFriends()
            }
            else {
                alert('Your friends email was not found')
            }
        })
    }

    $scope.removeFriend = function(obj) {
        var g = confirm("Are you sure you want remove " + obj.firstname + ' as a friend?');
        if (g == true) {
            mainSvc.removeFriend(obj.id).then(function(response) {
            seeMyFriends()
            $scope.seeItems();
        })
        } 
    }

    var seeMyFriends = function() {
        mainSvc.seeMyFriends().then(function(response) {
            $scope.myFriends = response.data
        })
    }
    seeMyFriends()
    $scope.cancel = function() {
        $scope.showInputField = 0
    }

    var clearPassChangedSuccess = function() {
        $scope.passChangedSuccess = ''
    }

    $scope.logout = function(){
        var a = confirm('Are you sure you want to logout?');
        if (a) {
            mainSvc.logout()
            seeUser()
            getName()
            seeMyFriends({email: $scope.currentUser})
        }
    }
})