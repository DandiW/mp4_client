var mp4Services = angular.module('mp4Services', []);

mp4Services.factory('CommonData', function(){
    var data = "";
    return{
        getData : function(){
            return data;
        },
        setData : function(newData){
            data = newData;
        }
    }
});

mp4Services.factory('Llamas', function($http, $window) {
    return {
        get : function() {
            var baseUrl = $window.sessionStorage.baseurl;
            return $http.get(baseUrl+'/api/llamas');
        }
    }
});


/////////////////////////////////////////////////////
angular.module('Services', [])
    .factory('UserID', function(){
        var selectedUserID = "";
        return{
            getUserID : function(){
                return selectedUserID;
            },
            setUserID : function(userID){
                selectedUserID = userID;
            }
        }
    })
    .factory('UserFunction', function($http, $window){
        return {
            get : function() {
console.log($window.sessionStorage.baseurl);
                return $http.get($window.sessionStorage.baseurl+'/api/users?select={"_id":1, "name":1}');
                
            },

            delete : function (userID) {
               
                return $http.delete($window.sessionStorage.baseurl + '/api/users/'+userID);
            },
            post : function (newUser) {
                
                return $http.post($window.sessionStorage.baseurl + '/api/users', $.param(newUser),{
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
                });
            },
            getUserTasks : function(userID){
               
                return $http.get($window.sessionStorage.baseurl+ '/api/tasks?where={"assignedUser":"'+userID+"\"}");
            },
            putUserTask : function(task){
               
                return $http.put($window.sessionStorage.baseurl+ '/api/tasks/'+task._id, $.param(task),{
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
                });
            }
        }
    })
//    .factory('UserDetailFunction', function($http, $window){
//        return {
//            get : function(userID) {
//                
//                return $http.get( $window.sessionStorage.baseurl + '/api/users/'+userID);
//            },
//            getByName : function(userName){
//                
//                return $http.get( $window.sessionStorage.baseurl + '/api/users?where={"name":\"'+userName+"\"}");
//            },
//            putUser : function(user){
//                
//                return $http.put( $window.sessionStorage.baseurl + '/api/users/'+user._id, $.param(user),{
//                    headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
//                });
//            }
//        }
//    })








    .factory('TaskID', function(){
        var selectedTaskID = "";
        return{
            getTaskID : function(){
                return selectedTaskID;
            },
            setTaskID : function(taskID){
                selectedTaskID = taskID;
            }
        }
    })
    .factory('TaskFunction', function($http, $window){
        return{
            get : function(query){
                
                return $http.get( $window.sessionStorage.baseurl + '/api/tasks'+query);
            },
            getTask : function(taskID){
                
                return $http.get( $window.sessionStorage.baseurl + '/api/tasks/'+taskID);
            },
            post : function (task) {
                
                return $http.post( $window.sessionStorage.baseurl + '/api/tasks', $.param(task),{
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
                });
            },
            put : function(task){
               
                return $http.put( $window.sessionStorage.baseurl + '/api/tasks/'+task._id, $.param(task),{
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
                });
            }
//            getByUser : function(userID){
//                
//                return $http.get( $window.sessionStorage.baseurl + '/api/tasks?where={"assignedUser":"'+userID+"\",\"completed\":false}");
//            },
//            getCompTasksByUser : function(userID){
//                
//                return $http.get( $window.sessionStorage.baseurl + '/api/tasks?where={"assignedUser":"'+userID+"\",\"completed\":true}");
//            },
//            delete : function (taskID) {
//               
//                return $http.delete( $window.sessionStorage.baseurl + '/api/tasks/'+taskID);
//            }
        }
    });

