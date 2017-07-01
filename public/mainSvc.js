angular.module('app').service('mainSvc', function ($http) {

  this.submit = (userInput) => {
    return $http.post('/api/list', userInput);
  }
  this.seeNames = () => {
    return $http.get('/api/list');
  }
  this.removeName = (id) => {
    return $http.delete('/api/list/' +id)
  }
  this.updateName = (obj) => {
    return $http.put('/api/listupdate', obj)
  }
  this.newUser = function (obj) {
    return $http.post('/api/create_user', obj)
  }
  this.checkUser = function(obj) {
    return $http.post('/api/check_user', obj)
  }
  this.seeUser = function() {
    return $http.get('/api/see_user')
  }
  this.logout = function() {
    return $http.post('/api/logout')
  }
  this.changePassword = function(obj) {
    return $http.post('/api/change_password', obj)
  }
  this.getName = function() {
    return $http.get('/api/get_name')
  }
})