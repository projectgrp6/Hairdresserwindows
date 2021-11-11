// Client ID and API key from the Developer Console
var CLIENT_ID =
  "619036585886-ge7imrkedupvpbtg1bkv0uld8e6rl3kg.apps.googleusercontent.com";
var API_KEY = "AIzaSyA38XREOdhFVAcFsfa96R1E_nuOH9vuVGI";

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES =
  "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events";

var authorizeButton = document.getElementById("authorize_button");
var signoutButton = document.getElementById("signout_button");
var clid;
/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load("client:auth2", initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client
    .init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    })
    .then(
      function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
      },
      function (error) {
        appendPre(JSON.stringify(error, null, 2));
      }
    );
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = "none";
    signoutButton.style.display = "block";
    listUpcomingEvents();
  } else {
    authorizeButton.style.display = "block";
    signoutButton.style.display = "none";
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  var pre = document.getElementById("content");
  var textContent = document.createTextNode(message + "hi \n");
  var eventinfo = document.createElement("l");

  message == "Upcoming events:"
    ? eventinfo.setAttribute("class", "message")
    : eventinfo.setAttribute("class", "appointments");
  eventinfo.setAttribute("id", clid);
  eventinfo.innerHTML = message;
  pre.appendChild(eventinfo);
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents() {
  gapi.client.calendar.events
    .list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: "startTime",
    })
    .then(function (response) {
      var events = response.result.items;
      appendPre("Upcoming events:");

      if (events.length > 0) {
        for (i = 0; i < events.length; i++) {
          var event = events[i];
          clid = event.id;
          console.log(event.id);
          var when = event.start.dateTime;

          if (!when) {
            when = event.start.date;
          }
          appendPre(event.summary + " (" + when + ")");
        }
      } else {
        appendPre("No upcoming events found.");
      }
    });
}
var today = new Date();
var dd = String(today.getDate()).padStart(2, "0");
var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
var yyyy = today.getFullYear();
// today = mm + "/" + dd + "/" + yyyy;
today = yyyy + "-" + mm + "-" + dd;

let calendar = document.querySelector("#calendar");
let appstart; //"2021-11-11T09:00:00+01:00";
let appEnd;
let hours = 9;
let minutes = "00";
console.log(appEnd);
function createOnDate() {
  if (calendar.value == "") {
    alert("Please choose a Date");
  } else if (calendar.value < today) {
    alert(
      "Invalid Date Selected, today is  " +
        today +
        " and your selected date is " +
        calendar.value
    );
  } else {
    appstart = calendar.value + "T" + hours + ":" + minutes + ":00+01:00";

    if (minutes == "30") {
      hours += 1;
      minutes = "00";
    } else {
      minutes = "30";
    }

    appEnd = calendar.value + "T" + hours + ":" + minutes + ":00+01:00";
    console.log(appstart);
    console.log(appEnd);
    createEvent();
  }
}

//===create event===============================================
let summaryText = document.querySelector("#apoint");
let descriptionText = document.querySelector("#descrip");
let attendee = document.getElementById("attendee");

function createEvent() {
  let event = {
    summary: `${summaryText.value}`,
    location: "Switzerland",
    description: `${descriptionText.value}`,
    start: {
      dateTime: appstart,
      timeZone: "Europe/Zurich",
    },
    end: {
      dateTime: appEnd,
      timeZone: "Europe/Zurich",
    },
    recurrence: ["RRULE:FREQ=DAILY;COUNT=1"],
    attendees: [{ email: attendee.value }],
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 },
        { method: "popup", minutes: 10 },
      ],
    },
  };

  const create = document.querySelector("#create");

  var request = gapi.client.calendar.events.insert({
    calendarId: "primary",
    resource: event,
  });

  request.execute(function (event) {
    appendPre("Event created: " + event.htmlLink);
  });
}
create.addEventListener("click", createOnDate);
function execute() {
  return gapi.client.calendar.events
    .delete({
      calendarId: "primary",
      eventId: "070dqpb2ecp1hrh3cmaftuu00o_20211112T080000Z",
    })
    .then(
      function (response) {
        // Handle the results here (response.result has the parsed body).
        console.log("Response", response);
      },
      function (err) {
        console.error("Execute error", err);
      }
    );
}
