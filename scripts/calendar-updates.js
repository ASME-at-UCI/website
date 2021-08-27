// Updates calendar with most 5 recent events from google calendar "ASME General Calendar"

const maxEvents = 5;


function postEvent(title, description, date){
	var newCard = `<div class="animate__animated card c-event-card">
					<div class="card-body">
					  <h4 class="card-title">`+ title + `</h4>
					  <p class="card-text">` + description + `</p>
					</div>
				</div>`;
	$("#google-calendar-cards").append(newCard);
}


function getData() {
	var result = null;
	var stat = null;
	
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
		var date = new Date();
		var extraZero = "0";
		if (date.getMonth() > 8) { 
			extraZero = "";
		}
		
		var stringDate = date.getFullYear() + "-" + extraZero + (date.getMonth() + 1) + "-" + date.getDate();
		console.log(stringDate);
        var stringy = "";
		var eventCount = 0;
		
		/*data.items.sort(function(a,b){
			console.log(a, b);
			return a.end[0] > b.end[0];
		});*/
		
		for(var i = 0; i < Object.keys(data.items).length && eventCount < maxEvents; i++) {
			console.log(data.items[i]);
			if ("end" in data.items[i]) {
				if ("date" in data.items[i].end) {
					console.log(data.items[i].end.date);
					if (stringDate < data.items[i].end.date) {
						postEvent(data.items[i].summary, data.items[i].description, data.items[i].htmlLink);
						eventCount++;

					}
				}
				else {
					console.log(data.items[i].end.dateTime);
					if (stringDate < data.items[i].end.dateTime) {
						postEvent(data.items[i].summary, data.items[i].description, data.items[i].htmlLink);
						eventCount++;

					}
				}


			}
		}
		
		$("#boop").text(stringy);
    },

    complete: function () {
        console.log('Finished all tasks');
    }
	});

	return result;
}


$(document).ready(function(){
	
	var result = getData();
})