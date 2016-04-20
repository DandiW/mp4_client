var mp4Controllers = angular.module('mp4Controllers', []);



mp4Controllers.controller('UsersController', ['$scope','$http', '$q', '$location', 'UserFunction', 'UserID', function($scope, $http, $q, $location ,UserFunction,UserID) {
     var selectedUserID = "";
     UserFunction.get()
        .success(function(data){
        $scope.users = data.data;

	});
    /////--------------user delete function-----------------------
     
   $scope.delete = function(userID){
       UserFunction.delete(userID).success(function(data){
           UserFunction.getAssignedOne(userID).success(function(data){
               var promises = [];
               var incompleteTasks = data.data;

               angular.forEach (incompleteTasks , function(task){
                   var unassignedTask = task;
                   unassignedTask.assignedUser = '';
                   unassignedTask.assignedUserName = 'unassigned';
                   promises.push(UserFunction.putUserTask(task));
                });
           $q.all(promises)
           .then(function(){
                $('#'+userID).css("display","none");
            });
           
           
       });
       
            });
};
    
    ///////////////////////////////////
       

       
  //---------------------------------------------     
   
    
    $scope.addUser = function() {
        $location.path( "/addUser");
    };

    $scope.oneuser = function(userID){
        
         selectedUserID = userID;
        
        $location.path("/users/"+userID);
    };

}]);

mp4Controllers.controller('UserDetailController', ['$scope', '$q','$location', 'UserFunction','TaskFunction','UserID' , 'TaskID', function($scope, $q, $location, UserFunction, TaskFunction, UserID, TaskID) {
  
   
    var currentUserId = $location.path().split("/")[2];
   

    
    
        var getUser = function(){         
            UserFunction.getUserDetail(currentUserId).success(function(data){
            $scope.user=data.data;
        });
    };
    
    getUser();
    
    TaskFunction.getPendingByUser(currentUserId).success(function(data){
            $scope.pendingTasks = data["data"];
        });
    
    $scope.getcompletedTasks = function(){
       TaskFunction.getCompTasksByUser(currentUserId).success(function(data){
           $scope.completedTasks = data["data"];
       })
        
    };

//    
//    $scope.delete = function(taskID,userID){
//       TaskFunction.delete(taskID).success(function(data){
//       //    if(userID){
//               UserFunction.getAssignedOne(userID).success(function(data){
//                   var promises =[];
//                   var OneUserData = data.data;
//                angular.forEach(OneUserData.pendingTasks, function(task){
//                           if(task==task._id){
//                             var index = OneUserData.pendingTasks.indexOf(taskID);
//                             OneUserData.pendingTasks.splice(index, 1);
//                             promises.push(UserFunction.putOneUser(userID));
//                    
//                            }     
//                                
//                });
//                $q.all(promises)
//                .then(function(){
//                        $('#'+taskID).css("display","none");
//                   });
//               
//               });
//               
//            });
// };
    //--------------------working version with error------------------------
    
    $scope.completeTask = function(taskID){
         TaskFunction.getTask(taskID).success(function(data){
             
             var Onetask = data.data;
             Onetask.completed = true;
             console.log("Onetask.completed="+Onetask.completed);
             
             TaskFunction.put(Onetask).success(function(data){
                   alert("succ");
                     UserFunction.getOneUser(currentUserId).success(function(data){
                         var promises =[];
                         var OneUserData = data.data;
                         console.log("OneUserData" + OneUserData); 
                         angular.forEach(OneUserData.pendingTasks, function(task){
                        
                                 var index = OneUserData.pendingTasks.indexOf(taskID);
                                 OneUserData.pendingTasks.splice(index, 1);
                             
                                    console.log(OneUserData);       

                        });
                         console.log("currentUserId"+currentUserId);
                         promises.push(UserFunction.putOneUser(OneUserData));   
                         $q.all(promises);

                     });
                 })
             .then(function(){
                                $('#'+taskID).css("display","none");
                           });
             
         });
    };
//    
    ///---------------

//    $scope.completeTask = function(taskID){
//         TaskFunction.getTask(taskID).success(function(data){
//             
//             var Onetask = data.data;
//             Onetask.completed = true;
//             console.log("Onetask.completed="+Onetask.completed);
//             
//             TaskFunction.put(Onetask).success(function(data){
//                   alert("succ");
//                     UserFunction.getOneUser(currentUserId).success(function(data){
//                         var promises =[];
//                         var OneUserData = data.data;
//                         console.log("OneUserData" + OneUserData); 
//                         angular.forEach(OneUserData.pendingTasks, function(task){
//                        
//                                 var index = OneUserData.pendingTasks.indexOf(taskID);
//                                 OneUserData.pendingTasks.splice(index, 1);
//                             
//                                    console.log(OneUserData);       
//
//                        });
//                         console.log("currentUserId"+currentUserId);
//                         promises.push(UserFunction.putOneUser(OneUserData));   
//                         $q.all(promises);
//
//                     });
//                 })
//             .then(function(){
//                                $('#'+taskID).css("display","none");
//                           });
//             
//         });
//    };
    

    
//    TaskFunction.getPendingByUser(currentUserId).success(function(tasks){
//            $scope.pendingTasks = tasks["data"];
//           alert($scope.pendingTasks);
//        });
//    
 

    $scope.details = function(taskID){
        $location.path("/tasks/"+taskID);
    }
}]);

//------------------------add user------------------------------
mp4Controllers.controller('UserAddController', ['$scope','$http', '$location', 'UserFunction', function($scope, $http, $location ,UserFunction) {
    $scope.user = {name: "", email: ""};
    var nameValid = false;
    var emailValid = false;

    $scope.$watch(
        function() {return $scope.user.name; },
        function(newValue, oldValue) {
            if ( newValue !== oldValue ) {
                nameValid = true;
            }
        }
    );
    
    $scope.$watch(
        function() {return $scope.user.email; },
        function(newValue, oldValue) {
            if ( newValue !== oldValue ) {

                if (!$scope.user.email || $scope.user.email.length < 1){
                    emailValid = false;
                }
                else{
                   
                    emailValid = true;
                }
            }
        }
    );
                                                                                        
	// function to submit the form after all validation has occurred			
	$scope.submitForm = function(isValid) {

		// check to make sure the form is completely valid
		if (isValid && nameValid && emailValid) { 
        UserFunction.post($scope.user).success(function (data) {
            $(".aftersubmit div h3").text(data.message);
            $(".aftersubmit").css("display", "");
            $(".aftersubmit div").css("background-color", "green");
            })
        
        .error(function (data){
                $(".aftersubmit").css("display", "");
                $(".aftersubmit div").css("background-color", "red");
                $(".aftersubmit div h3").text(data.message);
        })
            
			
		}

	};
//                                            
                                            
                                             }]);









mp4Controllers.controller('TasksController', ['$scope','$http', '$q', '$location', 'TaskFunction', 'UserID', 'UserFunction',function($scope, $http, $q, $location ,TaskFunction,UserID,UserFunction) {

    //var selectedTaskID ="";


    $scope.option = "pending";
    $scope.rank = "1";
    $scope.sortBy = "name";
   // var skip = 0;
    $scope.query = "";
    
 
    
    
    
    
 
//---------------------

   

    $scope.updateQuery = function() {
        console.log("updateQuery functuin running");
        var selectfull="?select={\"_id\":1,\"name\":1,\"assignedUserName\":1,\"dateCreated\":1, \"deadline\":1}";
        switch ($scope.option) {
            case "pending":
                $scope.query = selectfull+"&where={\"completed\":false}";
                 console.log("pending selected" + $scope.query );
                break;
            case "completed":
                $scope.query = selectfull+"&where={\"completed\":true}";
                console.log("completed selected" + $scope.query );
                break;
            case "all":
                $scope.query = selectfull;
                 console.log("all selected" + $scope.query );
                break;
           
        }
        switch ($scope.rank) {
            case "1":
                $scope.query += "&sort={\"" + $scope.sortBy + "\":1}";
                 console.log("true selected" + $scope.query );
                break;
            case "-1":
                $scope.query += "&sort={\"" + $scope.sortBy + "\":-1}";
                 console.log("false selected" + $scope.query );
                break;
        }
//        switch ($scope.sortBy) {
//            case "name":
//                $scope.query += "&sort={\"name\":1}";
//                 
//                break;
//            case "assignedUserName":
//                $scope.query += "&sort={\"assignedUserName\":1}";
//                
//                break;
//            case "deadline":
//                $scope.query += "&sort={\"deadline\":1}";
//                
//                break;
//            case "dateCreated":
//                $scope.query += "&sort={\"dateCreated\":1}";
//                 
//                break;
//        }
    
    
    
    };
    
       $scope.updateQuery();
       TaskFunction.get($scope.query)
        .success(function(data){
        $scope.tasks = data.data;
    });
//
//    
    $scope.$watch(
        function() {
            return $scope.query;
        },
        function(newValue, oldValue) {
            if (newValue !== oldValue) {
                TaskFunction.get($scope.query).success(function(data) {
                    $scope.tasks = data.data;
                    console.log($location.path());
                    
                });
                console.log("newValue"+newValue);
                console.log("oldevalue"+oldValue);
            }
        }
    );
    

    
    $scope.$watch("sortBy", function(newValue, oldValue) {
            if ( newValue !== oldValue )
                $scope.updateQuery(0);
        }
    );
    
    


    //---------------pagenation--------------------
        $scope.delete = function(taskID,userID){
       TaskFunction.delete(taskID).success(function(data){
       //    if(userID){
               UserFunction.getAssignedOne(userID).success(function(data){
                   var promises =[];
                   var OneUserData = data.data;
                angular.forEach(OneUserData.pendingTasks, function(task){
                           if(task==task._id){
                             var index = OneUserData.pendingTasks.indexOf(taskID);
                             OneUserData.pendingTasks.splice(index, 1);
                             promises.push(UserFunction.putOneUser(userID));
                    
                            }     
                                
                });
                $q.all(promises)
                .then(function(){
                        $('#'+taskID).css("display","none");
                   });
               
               });
               
            });
 };



    
    
    $scope.addTask = function() {
        $location.path( "/addTask");
    };

    $scope.onetask = function(taskID){
        
         //selectedTaskID = taskID;
        
        $location.path("/tasks/"+taskID);
    };


  
}]);





mp4Controllers.controller('TaskAddController', ['$scope','$http', '$q','$location', 'TaskFunction', 'UserFunction', function($scope, $http, $q, $location ,TaskFunction, UserFunction) {
    $scope.task = {name: "", description: "", deadline: "", completed: false, assignedUser:"", assignedUserName:"unassigned",dateCreated:""};
    var nameValid = false;
    var deadlineValid = false;

    UserFunction.get().success(function(data){
        $scope.users = data.data;
    });

    $scope.$watch(
        function() {return $scope.task.name;},
        function(newValue, oldValue) {
            if ( newValue !== oldValue ) {
                nameValid = true;
            }
        }
    );
    $scope.$watch(
        function() {return $scope.task.deadline; },
        function(newValue, oldValue) {
            if ( newValue !== oldValue ) {
                deadlineValid = true;
            }
        }
    );



    //--------------
    
    $scope.submitForm = function(isValid) {

		// check to make sure the form is completely valid
		if (isValid && nameValid && deadlineValid) { 
        TaskFunction.post($scope.task)
            .success(function (data) {
            
            alert('add successful');
            $(".aftersubmit div h3").text("Added");
            $(".aftersubmit").css("display", "");
            $(".aftersubmit div").css("background-color", "green");
            
            })
            
        
        .error(function (data){
                alert('failed to add');
                $(".aftersubmit").css("display", "");
                $(".aftersubmit div").css("background-color", "red");
                $(".aftersubmit div h3").text(data.message);
                 
        })
            
			
		}

	};
}]);

mp4Controllers.controller('SettingsController', ['$scope' , '$window' , function($scope, $window) {
  $scope.url = $window.sessionStorage.baseurl;
  
  $scope.setUrl = function(){
    $window.sessionStorage.baseurl = $scope.url;
    $scope.displayText = "URL set";

  };

}]);

mp4Controllers.controller('TaskDetailController', ['$scope', '$q','$location', 'UserFunction','TaskFunction','UserID' , 'TaskID', function($scope, $q, $location, UserFunction, TaskFunction, UserID, TaskID) {
  
    var currentTaskId = $location.path().split("/")[2];
    
    
        var getTaskinfo = function(){         
            TaskFunction.getTask(currentTaskId).success(function(data){
            $scope.task=data.data;
            });
        };
    
    getTaskinfo();
    
//    

    //--------------------working version with error------------------------
    
    $scope.ChangeStatus = function(){
         TaskFunction.getTask(currentTaskId).success(function(data){
           
             var Onetask = data["data"];
          console.log("Onetask1"+Onetask);
             if (Onetask.completed == true){
                 Onetask.completed = false;       
             }
             else{
                 Onetask.completed = true;
              
             }
            
             
             TaskFunction.put(Onetask).success(function(data){
//                 
                  $("#hide").css("visibility","visible");
                   //alert("Successfully!! Please Refresh the page.");
//                     UserFunction.getOneUser(currentUserId).success(function(data){
//                         var promises =[];
//                         var OneUserData = data.data;
//                         console.log("OneUserData" + OneUserData); 
//                         angular.forEach(OneUserData.pendingTasks, function(task){
//                        
//                                 var index = OneUserData.pendingTasks.indexOf(taskID);
//                                 OneUserData.pendingTasks.splice(index, 1);
//                             
//                                    console.log(OneUserData);       
//
//                        });
//                         console.log("currentUserId"+currentUserId);
//                         promises.push(UserFunction.putOneUser(OneUserData));   
//                         $q.all(promises);

//                     });
                 })
             
         });
    };


    
    $scope.editTask = function(){
        $location.path("/editTask/"+currentTaskId);
        
    }
}]);

//backup-------------------
//mp4Controllers.controller('TaskDetailController', ['$scope', '$location','$window','TaskFunction','TaskID', function($scope, $location, $window, TaskFunction, TaskID) {
//  
//    
//        
// 
//    var currentTaskId = $location.path().split("/")[2];
//   
//    
//        var getTaskInfo = function(){         
//            UserFunction.getTask(currentTaskId).success(function(data){
//            $scope.Task=data.data;
//        });
//    };
//    
//    getTaskInfo();
//
//
//    getTask();
////    
//    $scope.editTask = function(){
//        $location.path("/editTask/"+$scope.taskID);
//    }
//}]);

//-------------------------------


//mp4Controllers.controller('TaskEditController', ['$scope', '$location', 'TaskFunction','TaskID' , function($scope, $location, TaskFunction, TaskID) {
//  
//    
//    
//    $scope.editTask = function(){
//        $location.path("/editTask/"+$scope.taskID);
//    }
//}]);

//-----------------
mp4Controllers.controller('TaskEditController', ['$scope','$http', '$q','$location', 'TaskFunction', 'UserFunction', function($scope, $http, $q, $location ,TaskFunction, UserFunction) {
    
    var currentTaskId = $location.path().split("/")[2];
    
    var getTaskinfo = function(){         
            TaskFunction.getTask(currentTaskId).success(function(data){
            $scope.task=data.data;
            });
        };
    
    getTaskinfo();
    
    var nameValid = false;
    var deadlineValid = false;

    UserFunction.get().success(function(data){
        $scope.users = data.data;
    });

    $scope.$watch(
        function() {return $scope.task.name;},
        function(newValue, oldValue) {
            if ( newValue !== oldValue ) {
                nameValid = true;
            }
        }
    );
    $scope.$watch(
        function() {return $scope.task.deadline; },
        function(newValue, oldValue) {
            if ( newValue !== oldValue ) {
                deadlineValid = true;
            }
        }
    );



    //--------------

    
    $scope.submitForm = function(isValid) {

		// check to make sure the form is completely valid
		if (isValid && nameValid && deadlineValid) { 
        TaskFunction.post($scope.task)
            .success(function (data) {
            
            alert('add successful');
            $(".aftersubmit div h3").text("Updated");
            $(".aftersubmit").css("display", "");
            $(".aftersubmit div").css("background-color", "green");
            
            })
            
        
        .error(function (data){
                alert('failed to add');
                $(".aftersubmit").css("display", "Error");
                $(".aftersubmit div").css("background-color", "red");
                $(".aftersubmit div h3").text(data.message);
                 
        })
            
			
		}

	};
}]);