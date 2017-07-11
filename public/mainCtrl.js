angular.module('app').controller('mainCtrl',function($scope, mainSvc){

    let pause = false;

    const clearform = () => {
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

    const clearFirstName = () => {
        $scope.createName = ''
    }

    $scope.getNewDateTime = () => {
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
 
    $scope.submit = obj => {
        mainSvc.submit(obj).then( () => {
            $scope.seeItems()
            clearform()
        })
    }

    $scope.seeItems = () => {
        mainSvc.seeItems().then( response => {
            response.data.map( i => {
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
                setTimeout( () => {
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

    $scope.removeItem = id => {
        let r = confirm("Are you sure you want to delete this item?");
        if (r == true) {
            mainSvc.removeItem(id).then( () => {
            $scope.seeItems()
            })
        } 
    }

    $scope.edit = id => {
        ($scope.selected === id ? 
        $scope.selected = -1 : 
        $scope.selected = id)
        
        $scope.hideDelete ? 
        $scope.hideDelete = false : 
        $scope.hideDelete = true;
        pause = true
    }

    $scope.updateItem = newObj => {
        mainSvc.updateItem(newObj).then( () => {
            pause = false
            $scope.seeItems()
            $scope.selected = -1
            $scope.hideDelete = false
            clearform()
        })
    }

    $scope.newUser = userObj => {
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
            mainSvc.checkUser(userObj).then( response => {
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

    let seeUser = () => {
        mainSvc.seeUser().then( response => {
            $scope.currentUser = response.data
            $scope.currentUser ? 
            $scope.messageInfo = "Logged in." : 
            $scope.messageInfo = ""
            getName()
        })
    }

    seeUser();

    let getName = () => {
        mainSvc.getName().then( response => {
            if(response.data[0]) {
                $scope.userFirstname = response.data[0].firstname
            }
        })
    }
  

    $scope.checkUser = obj => {
        mainSvc.checkUser(obj).then( response => {
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
    $scope.changePassword = () => {
        $scope.showInputField = true
    }

    //submitNewPassword is a function that checks if the new password and repeat //new password are identical. If so it sends the service the object
    $scope.submitNewPassword = obj => {
        if (obj.newPass === obj.newPassVerify) {
            mainSvc.changePassword(obj).then( response => {
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

    $scope.addFriend = obj => {
        obj.friend = obj.friend.toLowerCase();
        mainSvc.addFriend(obj).then( response => {
            if (response.data !== 'error') {
                $scope.seeItems()
                seeMyFriends()
            }
            else {
                alert('Your friends email was not found')
            }
        })
    }

    $scope.removeFriend = obj => {
        let g = confirm("Are you sure you want remove " + obj.firstname + ' as a friend?');
        if (g == true) {
            mainSvc.removeFriend(obj.id).then( response => {
            seeMyFriends()
            $scope.seeItems();
        })
        } 
    }

    //this function removes ones self as a "friend". You dont want to accidentally remove yourslef from your friends or you wont see what you add to the items
    let removeMyselfAsFriend = data => {
        let friendsArray = []
        data.map(i => {
            if (i.email !== $scope.currentUser) {
                friendsArray.push(i)
            }
        })
        return friendsArray
    }

    let seeMyFriends = () => {
        mainSvc.seeMyFriends().then( response => {
            let friendsList = removeMyselfAsFriend(response.data) 
            $scope.myFriends = friendsList
        })
    }
    seeMyFriends()
    $scope.cancel = () => {
        $scope.showInputField = false
    }

    $scope.logout = () => {
        let a = confirm('Are you sure you want to logout?');
        if (a) {
            mainSvc.logout()
            seeUser()
            getName()
            seeMyFriends({email: $scope.currentUser})
        }
    }
})
