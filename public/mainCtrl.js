angular.module('app').controller('mainCtrl',function($scope, mainSvc){

    $scope.selected = -1
    $scope.editButtonName = 'Edit'

    
    $scope.currentUser = ''
    $scope.showInputField = 0
    $scope.changePasswordmessageInfo = ''
    $scope.passChangedSuccess = ''
    $scope.userFirstname = ''

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
        $scope.createName = ''
        $scope.passwordVerify = ''
    }



    $scope.submit = function(userInput){
        mainSvc.submit(userInput).then(function(){
            $scope.seeItems()
            clearform();
        })
    }

    // $scope.enter = function(e){
    //     if(e.keyCode === 13){
    //         $scope.submit($scope.userInput)
    //     }
    // }

    $scope.seeItems = function(){
        mainSvc.seeItems().then(function(response){
            $scope.items = response.data;
        })  
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
        ($scope.selected === id ? $scope.selected = -1 : $scope.selected = id);
        ($scope.selected === id ? $scope.editButtonName = 'Cancel' : $scope.editButtonName = 'Edit');
    }

    $scope.updateItem = function(newObj){
        mainSvc.updateItem(newObj).then(function(){
            $scope.seeItems()
            $scope.selected = -1
            $scope.editButtonName = 'Edit'
        })
    }

    $scope.newUser = function(userObj) {
        if (userObj.password !== userObj.passwordVerify){
            $scope.messageInfo = 'Your password did not match';
            clearform()
        }
        else {
            mainSvc.checkUser(userObj).then(function(response){
                console.log(response.data)
                if (!response.data[0] || response.data[0].email != userObj.email) {
                    mainSvc.newUser(userObj)
                    clearform();
                    $scope.messageInfo = 'Your account has been created!'
                }
                else {
                    $scope.messageInfo = "Sorry but that email is already being used"
                    clearform()
                }
            })
        }
    }

    var seeUser = function() {
        mainSvc.seeUser().then(function(response) {
            $scope.currentUser = response.data;
            $scope.currentUser ? $scope.messageInfo = "Logged in." : $scope.messageInfo = ""
            getName()
        })
    }

    seeUser();

    var getName = function() {
        mainSvc.getName().then(function(response) {
            if(response.data[0]) {
                $scope.userFirstname = response.data[0].firstname;
            }
        })
    }
  

    $scope.checkUser = function(obj) {
        mainSvc.checkUser(obj).then(function(response){
            if (response.data[0]) {
                $scope.seeItems()
                $scope.currentUser = response.data[0].email;
                $scope.messageInfo = "Logged in."
                clearform();
                getName();
            }
            else {
                $scope.messageInfo = "Sorry, that is all wrong"
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
            $scope.messageInfo = 'Logged in.'
            // setTimeout(clearPassChangedSuccess(), 3000);
        }
        else {
            $scope.messageInfo = 'Sorry your passwords do not match'
        }
        clearform()
    }

    $scope.cancel = function() {
        $scope.showInputField = 0;
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
        }
    }
})