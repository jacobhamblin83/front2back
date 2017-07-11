angular.module('app').service('mainSvc', function ($http) {

    this.submit = obj => $http.post('/api/list', obj)

    this.seeItems = () => $http.get('/api/list')

    this.removeItem = id => $http.delete('/api/list/' +id)

    this.updateItem = obj => $http.put('/api/listupdate', obj)

    this.newUser = obj => $http.post('/api/create_user', obj)

    this.checkUser = obj => $http.post('/api/check_user', obj)

    this.seeUser = () => $http.get('/api/see_user')

    this.logout = () => $http.post('/api/logout')

    this.changePassword = obj => $http.post('/api/change_password', obj)

    this.getName = () => $http.get('/api/get_name')

    this.addFriend = obj => $http.post('/api/add_friend', obj)

    this.removeFriend = id => $http.delete('/api/friends/' + id)

    this.seeMyFriends = () => $http.post('/api/see_friends')
})