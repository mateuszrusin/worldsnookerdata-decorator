
var frames = {"p1": 0, "p2": 0};
var halfs = {"p1": 0, "p2": 0};
var centuries = {"p1": 0, "p2": 0};
var points = {"p1": 0, "p2": 0};

var flow = [[0, 0]];

function countBreaks(tr) {
	countBreak(tr.find("td:eq(0)"), "p1");
	countBreak(tr.find("td:eq(4)"), "p2");
}

function countFrames(tr) {
	var p1 = +tr.find("td:eq(1)").text();
	var p2 = +tr.find("td:eq(3)").text();
	
	(p1 > p2) ?	frames.p1++ : frames.p2++;
	
	flow.push([frames.p1 + frames.p2, frames.p1 - frames.p2]);
}

function formatBreaks(p) {
	return "BREAKS<br>50+ (" + halfs[p] + ") 100+ (" + centuries[p] + ")";
}

function formatFrames(tr) {
	countFrames(tr);
	tr.find("td:eq(2)").append("<br />" + frames.p1 + ":" + frames.p2);
}

function formatPoints(p) {
	return "<br>(" + points[p] + ")";
}

function countBreak(td, p) {
	td.text().split(",").forEach((b) => {
		b >= 50 && (b >= 100 ? centuries[p]++ : halfs[p]++);
	});
}

function countPoints(tr) {
	points.p1 += +tr.find("td:eq(1)").text();
	points.p2 += +tr.find("td:eq(3)").text();
}

$("table.frame-data tbody tr").each(function() {
	var tr = $(this);
	
	countPoints(tr);
	countBreaks(tr);
	
	formatFrames(tr);
});

$("table.frame-data thead th span.tbl-hd-label")
	.eq(0).html(formatBreaks("p1")).end()
	.eq(1).append(formatPoints("p1")).end()
	.eq(3).append(formatPoints("p2")).end()
	.eq(4).html(formatBreaks("p2"));


$("table.matches-round tbody tr").each(function() {
	var tr = $(this);
	var href = tr.data("href");

	if (tr.data("url") != href) {	
		var link = $(document.createElement("a"))
			.attr("href", href)
			.append($(document.createElement("span"))
				.addClass("fa fa-chevron-right")
			);
		
		tr.find("td:last").append(link);
	}
});

$("#label-timer").each(function() {
	
	var second = 1000;
	var counter = 15;
	var elem = $(this).attr("id","my-timer").text(counter);
	
	setTimeout(function(){
	   window.location.reload();
	}, counter * second);
	
	setInterval(function() {
	    elem.text(--counter);
	}, second);
})

var players = {};

$("#iface-content table tbody tr").each(function() {
	var player = $(this).find("td:eq(1) a").text();
	players[player]  = ~~players[player] + 1;
}).each(function() {
	var a = $(this).find("td:eq(1) a");
	a.append(' (' + players[a.text()] + ')');
})

// ================================================= //

$(window).on('load', function() {
	
	var container = $("#match-result");
	
	if (container.length) {
		
		function getLabels(container) {
			var bestof = +container.find("p.frames").text().match(/\d+/g).pop();
			var result = Math.max(frames.p1, frames.p2);
			
			if (result > bestof/2) {
				return flow.map(v => v[0]);
			}
				
			return [...Array(++bestof).keys()];		
		}
		
		var div = $(document.createElement("canvas"))
			.attr("id", "match-chart")
			.css("backgroundColor", "#e7e7e7");
		
		container.append(div);
		
		var ticks = flow.map((val) => parseInt(val[1]));
		
		var myChart = new Chart(div, {
		    type: 'line',
		    data: {
		        labels: getLabels(container),
		        datasets: [{
		            data: flow.map(v => v[1]),
		            borderColor: '#e20039',
		            backgroundColor: '#e7e7e7',
		            borderWidth: 3,
		            tension: 0,
    				fill: false 
		        }]
		    },
		    options: {
		    	title: {
		    		text: 'GAME FLOW',
		    		display: true
		    	},
		    	legend: {
		    		display: false
		    	},
		        scales: {
		            yAxes: [{
		                ticks: {
		                    beginAtZero: true,
		                    min: Math.min(...ticks),
		                    max: Math.max(...ticks),
		                    stepSize: 1
		                },
		                gridLines: {
		                	zeroLineWidth: 3
		                }
		            }]
		        },
                layout: {
		            padding: 40
                },
                elements:{ 
                	point: {
						radius:3,
						pointStyle: 'circle'
					}
                }
		    }
		});
	}	
});

// ================================================= //


var tzs = [
    {"label":"(GMT-12:00) International Date Line West","value":"-12"},
    {"label":"(GMT-11:00) Midway Island, Samoa","value":"-11"},
    {"label":"(GMT-10:00) Hawaii","value":"-10"},
    {"label":"(GMT-09:00) Alaska","value":"-9"},
    {"label":"(GMT-08:00) Pacific Time (US & Canada)","value":"-8"},
    {"label":"(GMT-08:00) Tijuana, Baja California","value":"-8"},
    {"label":"(GMT-07:00) Arizona","value":"-7"},
    {"label":"(GMT-07:00) Chihuahua, La Paz, Mazatlan","value":"-7"},
    {"label":"(GMT-07:00) Mountain Time (US & Canada)","value":"-7"},
    {"label":"(GMT-06:00) Central America","value":"-6"},
    {"label":"(GMT-06:00) Central Time (US & Canada)","value":"-6"},
    {"label":"(GMT-05:00) Bogota, Lima, Quito, Rio Branco","value":"-5"},
    {"label":"(GMT-05:00) Eastern Time (US & Canada)","value":"-5"},
    {"label":"(GMT-05:00) Indiana (East)","value":"-5"},
    {"label":"(GMT-04:00) Atlantic Time (Canada)","value":"-4"},
    {"label":"(GMT-04:00) Caracas, La Paz","value":"-4"},
    {"label":"(GMT-04:00) Manaus","value":"-4"},
    {"label":"(GMT-04:00) Santiago","value":"-4"},
    {"label":"(GMT-03:30) Newfoundland","value":"-3.5"},
    {"label":"(GMT-03:00) Brasilia","value":"-3"},
    {"label":"(GMT-03:00) Buenos Aires, Georgetown","value":"-3"},
    {"label":"(GMT-03:00) Greenland","value":"-3"},
    {"label":"(GMT-03:00) Montevideo","value":"-3"},
    {"label":"(GMT-02:00) Mid-Atlantic","value":"-2"},
    {"label":"(GMT-01:00) Cape Verde Is.","value":"-1"},
    {"label":"(GMT-01:00) Azores","value":"-1"},
    {"label":"(GMT+00:00) Casablanca, Monrovia, Reykjavik","value":"0"},
    {"label":"(GMT+00:00) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London","value":"0"},
    {"label":"(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna","value":"1"},
    {"label":"(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague","value":"1"},
    {"label":"(GMT+01:00) Brussels, Copenhagen, Madrid, Paris","value":"1"},
    {"label":"(GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb","value":"1"},
    {"label":"(GMT+01:00) West Central Africa","value":"1"},
    {"label":"(GMT+02:00) Amman","value":"2"},
    {"label":"(GMT+02:00) Athens, Bucharest, Istanbul","value":"2"},
    {"label":"(GMT+02:00) Beirut","value":"2"},
    {"label":"(GMT+02:00) Cairo","value":"2"},
    {"label":"(GMT+02:00) Harare, Pretoria","value":"2"},
    {"label":"(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius","value":"2"},
    {"label":"(GMT+02:00) Jerusalem","value":"2"},
    {"label":"(GMT+02:00) Minsk","value":"2"},
    {"label":"(GMT+02:00) Windhoek","value":"2"},
    {"label":"(GMT+03:00) Kuwait, Riyadh, Baghdad","value":"3"},
    {"label":"(GMT+03:00) Moscow, St. Petersburg, Volgograd","value":"3"},
    {"label":"(GMT+03:00) Nairobi","value":"3"},
    {"label":"(GMT+03:00) Tbilisi","value":"3"},
    {"label":"(GMT+03:30) Tehran","value":"3.5"},
    {"label":"(GMT+04:00) Abu Dhabi, Muscat","value":"4"},
    {"label":"(GMT+04:00) Baku","value":"4"},
    {"label":"(GMT+04:00) Yerevan","value":"4"},
    {"label":"(GMT+04:30) Kabul","value":"4.5"},
    {"label":"(GMT+05:00) Yekaterinburg","value":"5"},
    {"label":"(GMT+05:00) Islamabad, Karachi, Tashkent","value":"5"},
    {"label":"(GMT+05:30) Sri Jayawardenapura","value":"5.5"},
    {"label":"(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi","value":"5.5"},
    {"label":"(GMT+05:45) Kathmandu","value":"5.75"},
    {"label":"(GMT+06:00) Almaty, Novosibirsk","value":"6"},
    {"label":"(GMT+06:00) Astana, Dhaka","value":"6"},
    {"label":"(GMT+06:30) Yangon (Rangoon)","value":"6.5"},
    {"label":"(GMT+07:00) Bangkok, Hanoi, Jakarta","value":"7"},
    {"label":"(GMT+07:00) Krasnoyarsk","value":"7"},
    {"label":"(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi","value":"8"},
    {"label":"(GMT+08:00) Kuala Lumpur, Singapore","value":"8"},
    {"label":"(GMT+08:00) Irkutsk, Ulaan Bataar","value":"8"},
    {"label":"(GMT+08:00) Perth","value":"8"},
    {"label":"(GMT+08:00) Taipei","value":"8"},
    {"label":"(GMT+09:00) Osaka, Sapporo, Tokyo","value":"9"},
    {"label":"(GMT+09:00) Seoul","value":"9"},
    {"label":"(GMT+09:00) Yakutsk","value":"9"},
    {"label":"(GMT+09:30) Adelaide","value":"9.5"},
    {"label":"(GMT+09:30) Darwin","value":"9.5"},
    {"label":"(GMT+10:00) Brisbane","value":"10"},
    {"label":"(GMT+10:00) Canberra, Melbourne, Sydney","value":"10"},
    {"label":"(GMT+10:00) Hobart","value":"10"},
    {"label":"(GMT+10:00) Guam, Port Moresby","value":"10"},
    {"label":"(GMT+10:00) Vladivostok","value":"10"},
    {"label":"(GMT+11:00) Magadan, Solomon Is., New Caledonia","value":"11"},
    {"label":"(GMT+12:00) Auckland, Wellington","value":"12"},
    {"label":"(GMT+12:00) Fiji, Kamchatka, Marshall Is.","value":"12"},
    {"label":"(GMT+13:00) Nuku'alofa","value":"13"}
];

function getTimeShifted(hours, shift) {
	var date = new Date();
	date.setHours(+hours[0]);
	date.setMinutes(+hours[1]);
	date.setHours(date.getHours() - shift - date.getTimezoneOffset() / 60);
    
    return date.getHours().toString().padStart(2, "0") 
    	+ ":" 
    	+ date.getMinutes().toString().padEnd(2, "0");
}

function timezoneSelect(){
	var options = [],
		select = document.createElement("select"),
		option = document.createElement("option");
	 
	option.appendChild(document.createTextNode("Choose venue timezone..."))
	
	select.appendChild(option);
	
	for (var i=0; i<tzs.length; i++){
		var tz = tzs[i],
		   option = document.createElement("option");
		
		option.value = tz.value
		option.appendChild(document.createTextNode(tz.label))
		select.appendChild(option)
	}
	
	return select;
}

var select = $(timezoneSelect()).css("width", "50%");   
   
select.on("change", function(event) {
	
	$("table#sessions tbody tr").each(function() {
		var td = $(this).find("td:eq(1)");
		var hours = td.html().split('<p>').shift().trim();
	
		td.html(
			hours +
			"<p>TMZ: " + getTimeShifted(hours.split(":"), +event.target.value) + "</p>"
		);
	});

})      
$("#iface-content > section h2:contains('Sessions')").parent().prepend(select);   

