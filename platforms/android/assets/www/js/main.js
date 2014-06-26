var plantations;

function init() {
	console.log("init");
	document.addEventListener("deviceready", onDeviceReady, "false");
	//onDeviceReady();

	$(document).on("pageinit", "#plantationPage", function() {
		var page = $(this);
		var query = $(this).data("url").split("?")[1];
		query = query.replace("id=","");
		var plantation = PlantationService.getPlantation(query);
		//$("h1", page).text(plantation.name);
		$("h1", page).text('Tour');
		$("#nameBlock").html(plantation.name);
		$("#headerBlock").html(plantation.header);
		$("#address").text(plantation.address);
		$("#gpscoordinates").text(plantation.gps.lat+","+plantation.gps.lng);
		$("#telurl").html((plantation.telephone?plantation.telephone+" &middot; ":"")+plantation.url?plantation.url:"");
		$("#drivingBlock").html(plantation.driving);
		$("#shareBlock").html("<button data-role='button' id='shareButton'>SHARE THIS</button>")
		$("#htmlBlock").load("plantations/"+plantation.detail);
		if(plantation.youtube) {
			var vidurl = "http://www.youtube.com/embed/"+plantation.youtube+"?rel=0";
			$("#videoframe").html("<iframe width='100%' height='315' src='"+vidurl+"' frameborder='0' allowfullscreen></iframe>");
		} else {
			$("#videoframe").html("");
		}

    $( "#shareButton" ).click(function() {
      window.plugins.socialsharing.share(plantation.name, null, null,plantation.url);
    });

	});

	$(document).on("pageinit", "#mapPage", function() {
		var yourStartLatLng = new google.maps.LatLng(30.04927, -90.60189);
        //$("#mapdiv").gmap({'center': yourStartLatLng});
		$('#mapdiv').gmap({'center':yourStartLatLng,'zoom':9}).bind('init', function(ev, map) {
			plantations.forEach(function(plantation) {
				var markerContent = plantation.name + "<br/>" + plantation.address;
				$('#mapdiv').gmap('addMarker', {'position': plantation.gps.lat+','+plantation.gps.lng, 'bounds': false}).click(function() {
					$('#mapdiv').gmap('openInfoWindow', {'content': markerContent}, this);
				});
			});
		});
	});

	$(document).on("pageshow", "#mapPage", function() {
		$('#mapdiv').gmap('get', 'map').setCenter(new google.maps.LatLng(30.04927, -90.60189));
        $("#mapdiv").gmap('refresh');
	});

    $(document).on("pageshow", "#plantationPage", function() {
		var page = $(this);
		var query = $(this).data("url").split("?")[1];
		query = query.replace("id=","");
        $("#drivingLink").attr("href","driving.html?id="+query);
    });

    $(document).on("pageshow", "#drivingPage", function() {
		var page = $(this);
		var query = $(this).data("url").split("?")[1];
		query = query.replace("id=","");
		var plantation = PlantationService.getPlantation(query);
        //get the most current location
        navigator.geolocation.getCurrentPosition(function(result) {
            var lng = result.coords.longitude;
            var lat = result.coords.latitude;
            var dirApi = new google.maps.DirectionsService();
            var dirReq = {};
            dirReq.destination = new google.maps.LatLng(plantation.gps.lat,plantation.gps.lng);
            dirReq.origin = new google.maps.LatLng(lat,lng);
            dirReq.travelMode = google.maps.DirectionsTravelMode.DRIVING;
            dirApi.route(dirReq,function(dirResult,dirStatus) {
                if (dirStatus != google.maps.DirectionsStatus.OK) {
                    alert("Driving API error: "+dirStatus);
                }
                //our steps are dirResult.routes[0].legs[0].steps
                var steps = dirResult.routes[0].legs[0].steps;
                var copy = dirResult.routes[0].copyrights;
                var niceSteps = [];

                for (var i = 0; i < steps.length; i++) {
                    step = {};
                    step.text = steps[i].instructions;
                    step.distance = steps[i].distance.text;
                    step.duration = steps[i].duration.text;
                    step.endlat = steps[i].end_location.lat();
                    step.endlon = steps[i].end_location.lng();
                    niceSteps[niceSteps.length] = step;
                }
                var s = "";
                for(var i=0,len=niceSteps.length; i<len; i++) {
                    s+= "<p><b>Duration:</b>" + niceSteps[i].duration + "<br/>";
                    s+= "<b>Distance:</b>" + niceSteps[i].distance + "<br/>";
                    s+= niceSteps[i].text+"</p>";
                }

                $("#drivingStatus").html(s);

                var yourStartLatLng = new google.maps.LatLng(plantation.gps.lat, plantation.gps.lng);
                $('#mapdrivingdiv').gmap({'center':yourStartLatLng,'zoom':12}).bind('init', function(ev, map) {
                    var markerContent = plantation.name + "<br/>" + plantation.address;
                    $('#mapdrivingdiv').gmap('addMarker', {'position': plantation.gps.lat+','+plantation.gps.lng, 'bounds': false}).click(function() {
                        $('#mapdrivingdiv').gmap('openInfoWindow', {'content': markerContent}, this);
                    });
                });

            });

        }, function(err) {
            $("#drivingStatus").html("Sorry, but we were unable to get your location and provide driving directions.");
            //For this app,if no geo, we don't care
        }, {enableHighAccuracy:true});

    });

	/*$(document).on("touchend",".photoShare",function(e) {
		console.log("fixing to share stuff");
		var source;
		if(e.currentTarget.id === "sharePhoto") {
			source = Camera.PictureSourceType.CAMERA;
		} else {
			source = Camera.PictureSourceType.PHOTOLIBRARY;
		}
		navigator.camera.getPicture(function(file) {
			setTimeout(function() {
				window.plugins.socialsharing.share(null, null, file);
			}, 500);
		},function(err) {
			navigator.notification.alert("Sorry, but the camera didn't work!", null, "Error");
		}, {
			quality:75,
			destinationType:Camera.DestinationType.FILE_URI,
			sourceType:source
		});
		console.dir(e.currentTarget.id);
	});*/

}

function onDeviceReady() {
	console.log("onDeviceReady");
	initLocationHB();
	//and do an initial location call right away. We have a sync issue btn jqm's pagedispaly and ondeviceready,
	//so if plantations still null, ask for it here
	if(!plantations) plantations = PlantationService.getPlantations();
	checkLocation();
}

function displayPlantations() {
	//The link below was in the html, but caused jqm rendering issues
	var s = '<li><a data-transition="slide" href="welcome.html">Welcome</a></li>';
	plantations = PlantationService.getPlantations();
	plantations.forEach(function(p,idx) {
		s+= "<li> <a data-transition='slide' style='font-size:13px' href='plantation.html?id="+idx+"'>"+p.thumbnail+"<span class='pname'>"+p.name+"</span><div id='pMile"+idx+"'></div></a></li>";
	});
	s+= '<li><a data-transition="slide" href="closing.html">Closing Comments</a></li>';
	$("#plantationListUI").append(s)
	$("#plantationListUI").listview("refresh",true);
}

//Used for location interval
var navHB;
//How often to check (currently 5 minutes)
var navHBDelay = 5 * 60 * 1000;
//close plantation
var closePlantation;

function initLocationHB() {
	console.log("Starting HB");
	navHB = window.setInterval(checkLocation, navHBDelay);
}

//Turns off the check - I'm not using this now - keeping it in case I change my mind
function disableLocationHB() {
	console.log("Ending HB");
	window.clearInterval(navHB);
}

function checkLocation() {
	console.log("checkLocation");
	navigator.geolocation.getCurrentPosition(function(result) {
		var lng = result.coords.longitude;
		var lat = result.coords.latitude;
		closePlantation = PlantationService.getNearPlantation(lng,lat,200);
		console.log("closePlantation="+closePlantation);

		//Call our utility function to handle display, no matter what
		displayClosePlantation();

		//per client req, set distances
		plantations = PlantationService.getPlantations();
		plantations.forEach(function(p, idx) {
			var m = p.distance * 0.62;
			m = Math.floor(m);
			$("#pMile"+idx).html(m + " miles</span>");
		});
	}, function(err) {
		//For this app,if no geo, we don't care
	}, {enableHighAccuracy:true});
}

function displayClosePlantation() {
	//Only care if we on the home page
	var currentPage = ($.mobile.activePage).attr("id");
	if(currentPage !== "homePage") return;
	//If we have one a cp, show the button, otherwise hide it
	if(closePlantation) {
		var s = '<a href="plantation.html?id='+closePlantation.id+'" data-role="button" data-theme="b">'+closePlantation.name + ' is nearby!</a>';
		$("#closePlantationDiv").html(s);
		$("#closePlantationDiv a").button();
		console.log('should see a button for '+closePlantation.name);
	} else {
		$("#closePlantationDiv").html("");
	}
}
