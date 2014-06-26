/*
A simple wrapper for plantation data, which due to the short list of
items will exist as hard coded data for now.

TODO: Wrap this up better so Plantation() is scoped to the service and not Window
*/

function Plantation(name, address, gps, telephone, url, detail, driving, youtube, imgname) {
	this.name=name;
	this.address=address;
	this.gps=gps;
	//cast to Number
	this.gps.lat = Number(this.gps.lat);
	this.gps.lng = Number(this.gps.lng);
	this.telephone=telephone;
	this.url=url;
	this.detail=detail;
	this.driving=driving;
	this.youtube=youtube;
	this.thumbnail="<img style='vertical-align:middle' width='70px' src='css/images/thumbs/" + imgname + "' >";
	this.header="<img width='480px' src='css/images/headers/" + imgname + "' >";
	this.distance = -1;
	return this;
}

var PlantationService = {

	plantations:[
		new Plantation("Destrehan Plantation","13034 River Rd. Destrehan, LA 70047",
			{lat:"29.94516",lng:"-90.36571"},"985-764-9315","destrehanplantation.org","destrehan.html",
			"From I-10 West, leaving New Orleans, merge onto I-310, take exit 220 toward Boutte. Merge onto River Road/LA-48, via Exit 6 toward St. Rose. Take a left and drive .2 miles and Destrehan Plantation is on the left.",
			"TeywyIqA9uc","destrehan.jpg"),
		new Plantation("Ormond Plantation","13786 River Rd. Destrehan, LA 70047",
			{lat:"29.95381",lng:"-90.38721"},"985-764-8544","plantation.com","ormond.html",
			"From Destrehan Plantation, take a right on River Road. Drive 1.26 miles and Ormond Plantation is on the right.<br/>From I-10 West, leaving New Orleans, merge onto I-310, take exit 220 toward Boutte. Merge onto River Road/LA-48, via Exit 6 toward St. Rose. Take a right and drive 1.4 miles and Ormond Plantation is on the right at 13786 River Road.",
			"-QWfwdzle9Q","ormond.jpg"),
		new Plantation("San Francisco Plantation","2646 Hwy. 44 (River Road E) Garyville, LA 70051",
			{lat:"30.04927",lng:"-90.60189"},"985-535-2341","sanfranciscoplantation.org","sanfran.html",
			"From Ormond Plantation, turn right toward Avenue of Oaks, and take the 3rd right onto Ormond Blvd. Go 3 miles and turn left onto US-61-Airline Highway. Drive 13.4 miles and turn left onto Central Ave/LA-53. Turn right onto LA-44/Jefferson Hwy., in 3 miles San Francisco Plantation will be on your right.",
			"TmvPny5wsBo","san-francisco.jpg"),
		new Plantation("Evergreen Plantation","4677 Hwy.18 Edgard, LA 70049",
			{lat:"30.02751",lng:"-90.63889"},null,null,"evergreen.html",
			"From San Francisco Plantation, turn right onto LA-44/River Rd E toward Antebellum St. Continue to follow LA-44 for 5.3 miles. Turn right onto LA-3213 S. In 2.8 miles take the LA-18 ramp toward Edgard/Vacherie. Turn right onto LA-18/Great River Rd. In 2.6 miles you will see Evergreen on your right.",
			"bmVAl16cvIU","evergreen.jpg"),
		new Plantation("Laura: A Creole Plantation","2247 Hwy. 18 Vacherie, LA 70090",
			{lat:"30.00861",lng:"-90.72527"},"225-265-7690","lauraplantation.com","laura.html",
			"From Evergreen, turn right onto LA-18/Great River Rd toward W 5th St. Continue to follow LA-18. In 6.6 miles, Laura Plantation will be on your right.",
			"WHNXzo15__k","laura.jpg"),	
		new Plantation("St. Joseph Plantation","3535 Hwy. 18 Vacherie, LA 70090",
			{lat:"30.00687",lng:"-90.77245"},"225-265-4078","stjosephplantation.com","st-joseph.html",
			"From Laura Plantation, take a right onto LA-18 toward LA-20. In 2.9 miles, St. Joseph Plantation will be on your right.",
			"VrdsDeHMMvQ","st-joseph.jpg"),	
		new Plantation("Oak Alley Plantation","3645 Hwy. 18 Vacherie, LA 70090",
			{lat:"30.00500",lng:"-90.77889"},"225-265-2151","oakalleyplantation.org","oak-alley.html",
			"From St. Joseph Plantation, turn right on LA-18. In .3 miles Oak Alley will be on your right.",
			"yMRnX-R5c3I","oak-alley.jpg"),	
		new Plantation("Poche Plantation","3645 Hwy. 18 Vacherie, LA 70090",
			{lat:"30.00500",lng:"-90.82778"},"225-715-9510","pocheplantation.com","poche.html",
			"From Oak Alley, turn right onto LA-18 E toward Oak Alley Farm Rd. In 7.5 miles turn right onto the ramp to LA-3213 N, taking a slight right onto LA-3213 N. In 2.1 miles turn left onto the ramp to LA-44/ Reserve/ Gramercy/ Lutcher. In .9 miles turn right onto LA-44. Poché Plantation will be on the right in 11.6 miles.",
			"4o3iPzhBq0s","poche.jpg"),	
		new Plantation("Houmas House Plantation","40136 Hwy. 942 Darrow, LA 70725",
			{lat:"30.14031",lng:"-90.93436"},"225-473-9380","houmashouse.com","houmas-house.html",
			"From Poche Plantation, turn right onto LA-44 N. In 11.9 miles turn left onto LA-942 W/ River Rd. In .4 miles Houmas House Plantation & Gardens will be on your right.",
			"oGCSpONMq3s","houmas-house.jpg")
],

	getPlantation:function(x) {
		return this.plantations[x];
	},

	getPlantations:function() {
		return this.plantations;
	},

	//Given your lng/lat, tell me the closest plantion within minkm distance
	//Updated to also store the distance
	getNearPlantation:function(lng,lat,minkm) {
		var nearestPlantation;
		var nearestDist = 99999999;

		//Credit: http://stackoverflow.com/questions/27928/how-do-i-calculate-distance-between-two-latitude-longitude-points
		//Which goes to http://www.movable-type.co.uk/scripts/latlong.html
		var R = 6371;
		this.plantations.forEach(function(p,idx) {
			var dLat = (p.gps.lat-lat).toRad();  // Javascript functions in radians
			var dLon = (p.gps.lng-lng).toRad();
			var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
			        Math.cos(lat.toRad()) * Math.cos(p.gps.lat.toRad()) *
			        Math.sin(dLon/2) * Math.sin(dLon/2); 
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
			var d = R * c; // Distance in km
			//So logic is simple - if d < minkm, we store it,
			//but check to see if we have a current near one,
			//and only store if less than that
			//console.log("for "+p.name+" dist is "+d);
			if(d < minkm && d < nearestDist) {
				nearestPlantation = p;
				nearestPlantation.id = idx;
				nearestDist = d;
			}
			plantations[idx].distance = d;
		});

		return nearestPlantation;
	}
};


//Used by GPS stuff and part of the logic used for location - not sure I like this out there.
if (typeof Number.prototype.toRad == 'undefined') {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  };
}
