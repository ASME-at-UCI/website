// Updates calendar with most 5 recent events from google calendar "ASME General Calendar"

//Doesn't handle recurring events

const MAX_EVENTS = 5;
const DEFAULT_TIME = "T00:00:00-07:00"; //Set to PDT

var postEventCount = 0;
function postEvent(title, description, date, link){
	postEventCount++;
	let todayBadge = "";
	if (isSameDay(date, getCurrentDate())) {
		todayBadge = `<span class="badge c-new-badge">Today</span>`;
	}
	let id = "event-card-" + postEventCount;
	let newCard = `<div data-toggle="collapse" data-target="#` + id + `" class="animate__animated card c-event-card ">
						<div class="card-body ">
						<h4 class="card-title hvr-icon-down">
							`+ title + todayBadge +`
							<i  class="fas fa-angle-down hvr-icon"></i>
						</h4>
							<div class="card-text">
								`+ parseDateToReadable(date) +`
							</div>
							<div id="` + id + `" class="collapse">				
								<br>	
								`+ description +`
								<br><br>
								<a href="`+ link +`" target="_blank">Add to calendar</a>
							</div>
						</div>						
		  			</div>`;
	$("#google-calendar-cards").append(newCard);
}



function getCurrentDate() {
		let date = new Date();
		let extraZeroM = "0";
		if (date.getMonth() > 8) { 
			extraZeroM = "";
		}
		let extraZeroD = "0";
		if (date.getDate() > 9) { 
			extraZeroD = "";
		}
		
		let stringDate = date.getFullYear() + "-" + extraZeroM + (date.getMonth() + 1) + "-" + extraZeroD + date.getDate();
		console.log(stringDate);

	return stringDate + DEFAULT_TIME;
}

function isSameDay(stringDate1, stringDate2) {
	let date1 = new Date(stringDate1);
	let date2 = new Date(stringDate2);
	return (date1.getDate() == date2.getDate()) && (date1.getMonth() == date2.getMonth());
}

function getEventStartDate(x) {
	//returns '0' if no date
	if ("start" in x) {
		if ("date" in x.start) {
			return x.start.date + DEFAULT_TIME;
		}
		else if ("dateTime" in x.start) {
			return x.start.dateTime;
		}
		else return "0";
	}
	else return "0";
}

function getEventDate(x) {
	//returns '0' if no date
	if ("end" in x) {
		if ("date" in x.end) {
			return x.end.date + DEFAULT_TIME;
		}
		else if ("dateTime" in x.end) {
			return x.end.dateTime;
		}
		else return "0";
	}
	else return "0";
}

function parseDateToReadable(stringDate) {
	console.log(stringDate);
	let date = new Date(stringDate);
	console.log(date.getDate());
	console.log(date.getHours());
	let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	let dateEndings = ["st", "nd", "rd", "th"];
	let hours = date.getHours();
	let stamp = "AM";
	let time = "";
	let minutes = date.getMinutes() < 9 ? "0" + date.getMinutes() : date.getMinutes();
	
	if (hours > 12) {
		hours = date.getHours() - 12;
		stamp = "PM";
	}
	if (hours != 0) {
		time = ", " + hours + ":" + minutes + " " + stamp;	
	}
	return "" + days[date.getDay()] + ", " + months[date.getMonth()] + " " + date.getDate() + (date.getDate() > 4 ? "th" : dateEndings[date.getDate() - 1]) + ", " + date.getFullYear() + time;
}

function isAfterCurrentDate(x){
	let eventDate = getEventDate(x);
	if (getCurrentDate() < eventDate) {
		return true;	
	}
	else return false;
}

function eventsAfterCurrentDate(eventsList) {
	return eventsList.filter(isAfterCurrentDate);

}


function orderEvents(eventsList) {
	return eventsList.sort(function (a,b){
			if (getEventDate(a) > getEventDate(b)) {
				return 1;
			}
			else if (getEventDate(a) == getEventDate(b)) {
				return 0;
			}
			else {
				return -1;
			}
	});
}


function getData() {
	let result = null;
	let stat = null;
	
	$.ajax({
    url: "https://www.googleapis.com/calendar/v3/calendars/fkrnncaoabqplq6ps08b01suf8@group.calendar.google.com/events?key=AIzaSyBT7UEh989MTpktfCQndnRuXlssCvDxyuM",
    dataType: "json",
    cache: false,

    beforeSend: function () {
        console.log("Loading");
    },

    error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
    },

    success: function (data) {
			
		let eventsList = orderEvents(eventsAfterCurrentDate(data.items));
		
		let eventCount = 0;	
		if (eventsList.length == 0) {
			let warningMessage = `<h3 class="animate__animated pt-2 mx-auto animate__fadeInUp" style="text-align: center; color: red;">
      								Uh oh! There are no events right now.
								</h3>.`
			$("#google-calendar-cards").append(warningMessage);
		}
		for (const event of eventsList) {
			console.log(event);
			postEvent(event.summary, event.description, getEventStartDate(event), event.htmlLink);
			eventCount++;
			if (eventCount >= MAX_EVENTS){
				break;
			}
		}	
    },

    complete: function () {
        console.log('Finished all tasks');
    }
	});

	return result;
}


$(document).ready(function(){
	getData();
})