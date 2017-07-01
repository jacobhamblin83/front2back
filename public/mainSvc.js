angular.module('app').service('mainSvc', function ($http) {

  this.submit = function (userInput) {
    return $http({
      method: "POST",
      url: "/api/list",
      data: {
        item: userInput
      }
    })
  }
  this.seeNames = function () {
    return $http({
      method: "GET",
      url: "/api/list",
    })
  }
  this.removeName = function (id) {
    return $http({
      method: "DELETE",
      url: "/api/list/" + id
    })
  }
  this.updateName = function (obj) {
    return $http({
      method: "PUT",
      url: "/api/listupdate",
      data: obj
    })
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
})