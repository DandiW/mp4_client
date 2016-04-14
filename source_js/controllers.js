var mp4Controllers = angular.module('mp4Controllers', []);



mp4Controllers.controller('UsersController', ['$scope','$http', '$q', '$location', 'UserFunction', 'UserID', function($scope, $http, $q, $location ,UserFunction,UserID) {
     var selectedUserID = "";
     UserFunction.get()
        .success(function(data){
        $scope.users = data.data;

	});
        
    
    $scope.addUser = function() {
        $location.path( "/addUser");
    };

    $scope.oneuser = function(userID){
        
         selectedUserID = userID;
        
        $location.path("/users/"+userID);
    };

}]);


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









mp4Controllers.controller('TasksController', ['$scope','$http', '$q', '$location', 'TaskFunction', 'UserID', function($scope, $http, $q, $location ,TaskFunction,UserID) {

    var selectedTaskID ="";
$scope.events = [];
$scope.itemsPerPage = 10; //items to show per page
$scope.currentPage = 1;  //what page to start on



    
     $scope.query = "";
    
    TaskFunction.get($scope.query)
        .success(function(data){
        $scope.tasks = data.data;
    });
//---------------------

   

    $scope.updateQuery = function(skipnumber) {
        var selectfull="select={\"_id\":1,\"name\":1,\"assignedUserName\":1, \"deadline\":1}";
        switch ($scope.option) {
            case "pending":
                $scope.query = "?where={\"completed\":false}";
                break;
            case "completed":
                $scope.query = "?where={\"completed\":true}";
                break;
            case "all":
                $scope.query = "?"+selectfull;
                break;
            default:
                $scope.query = "?where={\"completed\":false}";
        }
        switch ($scope.ascending) {
            case "true":
                $scope.query += "&sort={\"" + $scope.sortBy + "\":-1}"+"&limit=10";
                break;
            case "false":
                $scope.query += "&sort={\"" + $scope.sortBy + "\":-1}"+"&limit=10";
                break;
        }
    };
    

    //----------------------
    
       
//-----------------



    
    
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
                $(".aftersubmit div").css("background-color", "#cc0000");
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



mp4Controllers.controller('TaskDetailController', ['$scope', '$location', 'TaskFunction','TaskID' , function($scope, $location, TaskFunction, TaskID) {
  

    $scope.editTask = function(){
        $location.path("/editTask/"+$scope.taskID);
    }
}]);


mp4Controllers.controller('TaskEditController', ['$scope', '$location', 'TaskFunction','TaskID' , function($scope, $location, TaskFunction, TaskID) {
  
    
    
    $scope.editTask = function(){
        $location.path("/editTask/"+$scope.taskID);
    }
}]);

