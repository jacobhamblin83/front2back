angular.module('app').controller('mainCtrl',function($scope, mainSvc){

    var pause;

    const clearform = function() {
        $scope.items;
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
        $scope.currentUser = $scope.currentUser || ''
        $scope.changePasswordmessageInfo = ''
        $scope.userFirstname = $scope.userFirstname || ''
        $scope.myFriends = ''
        $scope.selected = -1
        $scope.hideDelete = false
        $scope.showInputField = false
        pause = false
    }
    clearform()

    const clearFirstName = function() {
        $scope.createName = ''
    }

    $scope.getNewDateTime = function() {
        let d = new Date;
        let min = d.getMinutes()
        let hr = function(){
           if (d.getHours()>12) {
               return d.getHours() -12
           }
           else if (d.getHours() === 0) {
               return 12
           }
           else return d.getHours()
        }
        let day = d.getDate()
        let month = d.getMonth()
        return `${hr()}:${min} ${month}/${day}`
    }
 
    $scope.submit = function(obj){
        mainSvc.submit(obj).then(function(){
            $scope.seeItems()
            clearform()
        })
    }

    $scope.seeItems = function(){
        mainSvc.seeItems().then(function(response){
            response.data.map(function(i) {
                let f = new Date
                let g = f.getDate()
                let e = i.date_string.split('/')
                let h = i.date_string.split(' ')
                //if the date the item was created is today then only the 
                //time shows
                if (e[1] == g) {
                    i.date_string = h[0]
                }
                //otherwise only the date shows
                else if (e[1] != g) {
                    i.date_string = h[1]
                }
            })
            //pause is set to 0 unless you are in the middle of editing
            //one of the items in which case pause is 1
            //once you submit the item and are done editing it, pause is 
            //set back to 0
            if (!pause) {
                $scope.items = response.data
                setTimeout(function() {
                    $scope.seeItems() 
                }
                    , 30000)
            }
        })  
        //the setTimeout function continually checks for new items add
        //by friends
        //not really the way i would like to do it but it works...kind of
        //there is a problem when trying to edit your item when seeItems
        //runs again and you are in the middle of typing
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
        $scope.hideDelete ? $scope.hideDelete = false : $scope.hideDelete = true;
        pause = true
    }

    $scope.updateItem = function(newObj){
        mainSvc.updateItem(newObj).then(function(){
            pause = false
            $scope.seeItems()
            $scope.selected = -1
            $scope.hideDelete = false
            clearform()
        })
    }

    $scope.newUser = function(userObj) {
        //set email to all lowercase just in case they mess up
        userObj.email = userObj.email.toLowerCase()
        //keep length less than 10 characters
        if (userObj.createName.length > 10) {
            alert('Your firstname must be less than 10 characters')
            //clear the firstname field and exit the function
            return clearFirstName()
        }
        //check if password and retype password match 
        if (userObj.password !== userObj.passwordVerify){
            alert('Your password did not match')
            //clear the form and exit the function
            return clearform()
        }
        //if all is ok continue
        else {
            mainSvc.checkUser(userObj).then(function(response){
                //check if the email is already in the database
                if (!response.data[0] || response.data[0].email != userObj.email) {
                    mainSvc.newUser(userObj)
                    clearform()
                    alert(userObj.createName + '. Your account has been created! You can now login')
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
        $scope.showInputField = true
    }

    //submitNewPassword is a function that checks if the new password and repeat //new password are identical. If so it sends the service the object
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
        obj.friend = obj.friend.toLowerCase();
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

    //this function removes ones self as a "friend". You dont want to accidentally remove yourslef from your friends or you wont see what you add to the items
    var removeMyselfAsFriend = function(data) {
        var friendsArray = []
        data.map(function(i) {
            if (i.email !== $scope.currentUser) {
                friendsArray.push(i)
            }
        })
        return friendsArray
    }

    var seeMyFriends = function() {
        mainSvc.seeMyFriends().then(function(response) {
            var friendsList = removeMyselfAsFriend(response.data) 
            $scope.myFriends = friendsList
        })
    }
    seeMyFriends()
    $scope.cancel = function() {
        $scope.showInputField = false
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
