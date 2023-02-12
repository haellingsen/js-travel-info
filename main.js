let defaultText = `RP/XXXXDDDDD/XXXXDDDDD            IB/SU  DDMMMYY/HHMMZ   REFNBR
1.NNNNNN/NNNNN NNNN MS
2.NNNNNN/NNNNN NNNN(CHD/DDMMMYY)
3.NNNNNN/NNNNN MR   4.NNNNNN/NNNNN MR
5.NNNNNN/NNNNN(CHD/DDMMMYY)
6  KL1234 R 11MMM 6 KRSAMS HK5          1212 0435   *1A/E*
7  KL1234 R 11MMM 6 KRSAMS HK5          1112 1440   *1A/E*
8  KL1234 T 11MMM 6 AMSKRS HK5          1215 1400   *1A/E*
9  KL1234 T 11MMM 6 AMSKRS HK5          1612 1945   *1A/E*`

$("#inputField").val(defaultText);


function parseFlightLine(line) {
    index_flight_no = 3
    length_flight_no = 6
    index_flight_date = 12
    length_flight_date = 5
    index_location = 20
    length_location = 6
    length_time = 4
    length_time_arrival = 6
    index_flight_time_boarding = 32
    index_flight_time_departure = 40
    index_flight_time_arrival = 45
    index_class = 52
    length_class = 6

    if (/^\d\d/.test(line)) {
        index_flight_no = index_flight_no + 1
        index_flight_date = index_flight_date + 1
        index_location = index_location + 1
        index_flight_time_boarding = index_flight_time_boarding + 1
        index_flight_time_departure = index_flight_time_departure + 1
        index_flight_time_arrival = index_flight_time_arrival + 1
        index_class = index_class + 1
    }

    flight_no = line.substring(index_flight_no, index_flight_no + length_flight_no).trim()
    flight_date = line.substring(index_flight_date, index_flight_date + length_flight_date).trim()
    location_code = line.substring(index_location, index_location + length_location).trim()
    time_boarding = line.substring(index_flight_time_boarding, index_flight_time_boarding + length_time).trim()
    time_departure = line.substring(index_flight_time_departure, index_flight_time_departure + length_time).trim()
    time_arrival = line.substring(index_flight_time_arrival, index_flight_time_arrival + length_time_arrival).trim()
    class_ = line.substring(index_class, index_class + length_class).trim()
    location_code_from = location_code.substring(0, 3)
    location_code_to = location_code.substring(3, 6)
    location_name_from = getAirportNameFromCode(location_code_from, airports)
    location_name_to = getAirportNameFromCode(location_code_to, airports)
    return {
        flight_no: flight_no,
        flight_date: flight_date,
        location_from: location_code_from + " (" + location_name_from + ")",
        location_to: location_code_to + " (" + location_name_to + ")",
        time_boarding: time_boarding,
        time_departure: time_departure,
        time_arrival: time_arrival,
        class: class_
    }
}

function parseInput() {
    var input = document.getElementById("inputField").value;
    var inputLines = input.split("\n");
    var outputTablePassengers = $("#outputTablePassengers").find("tbody");
    var outputTableFlights = $("#outputTableFlights").find("tbody");

    // clear tables
    outputTablePassengers.html("");
    outputTableFlights.html("");

    for (var i = 0; i < inputLines.length; i++) {
        var line = inputLines[i].trim();
        // skip if line is empty
        if (line == "" || line == null || line == undefined || line == " ") {
            continue;
        }
        parseLine(line, outputTablePassengers, outputTableFlights);
    }

}

function getAirportNameFromCode(code, airportdict) {
    for (let i = 0; i < airportdict.length; i++) {
        if (airportdict[i].iata == code) {
            return airportdict[i].airport;
        }
    }
}

function combineEntrySpanningMultipleLines(lines) {

}


function parseLine(line, passengertable, flighttable) {


    if (line.startsWith("RP")) {
        let referenceNumberIndex = 56;
        // get the four letters and put them in to the element with id  "outputReferenceNumber"
        var referenceNumber = line.substring(referenceNumberIndex, referenceNumberIndex + 7);
        $("#outputReferenceNumber").html(referenceNumber);
        return;
    }

    if (/^\d{1,2}\sHTL/.test(line)) {
        // hotel information
        return;
    }

    if (/^\d{1,2}\sTUR/.test(line)) {
        // tour information
        return;
    }

    // test if line starts with a number then a space then four letters
    if (/^\d{1,2}\s\s[A-Z]{4}/.test(line)) {
        return;
    }

    // if line is passenger information
    if (/^\d{1,2}\./.test(line)) {
        // person information
        // split by number and period
        let names = line.split(/\d\./);
        // remove empty elements
        names = names.filter(function(el) {
            return el != "" && el != null;
        });

        // remove leading and trailing spaces
        for (let i = 0; i < names.length; i++) {
            names[i] = names[i].trim();
        }

        // loop through names
        for (let i = 0; i < names.length; i++) {

            // split by slash
            let nameParts = names[i].split("/");

            // last name is first element
            let lastname = nameParts[0];

            // first name is the rest of the string
            let firstname = nameParts.slice(1).join("");

            // split first name by space
            firstname = firstname.split(" ");

            // check for titulation
            let titulation = "";
            // check if first name contains MR or MS
            if (firstname.join(" ").includes("MR") || firstname.join(" ").includes("MS")) {
                // get titulation 
                titulation = firstname[firstname.length - 1];
                // remove titulation from first name
                firstname = firstname.slice(0, firstname.length - 1);
            }

            // First letters of names are uppercase and the rest is lowercase
            lastname = lastname.charAt(0).toUpperCase() + lastname.slice(1).toLowerCase();

            for (let i = 0; i < firstname.length; i++) {
                firstname[i] = firstname[i].charAt(0).toUpperCase() + firstname[i].slice(1).toLowerCase();
            }

            // join first name to one string
            firstname = firstname.join(" ");

            // check if first name contains child information (CHD/DDMMMYY) and remove it from first name
            // and save it in birthDate variable
            let birthDate = "";
            if (firstname.includes("(")) {
                birthDate = firstname.slice(firstname.indexOf("(") + 4, firstname.indexOf(")")).trim();
                firstname = firstname.slice(0, firstname.indexOf("("));
            }

            // create table row
            passengertable.append($('<tr>')
                .append($('<td>').text(titulation))
                .append($('<td>').text(firstname))
                .append($('<td>').text(lastname)));

        }

    }

    if (/^\d{0,2}\s/.test(line)) { // check if line is flight information

        var flightInfo = parseFlightLine(line)

        // flight information
        flighttable.append($('<tr>')
            .append($('<td>').text(flightInfo.flight_no))
            .append($('<td>').text(flightInfo.location_from))
            .append($('<td>').text(flightInfo.location_to))
            .append($('<td>').text(flightInfo.flight_date))
            .append($('<td>').text(flightInfo.time_departure))
            .append($('<td>').text(flightInfo.time_arrival)));
    }
}

function parseFlightLineOld(line) {
    var lineParts = line.split(" ")
    lineParts = lineParts.filter(function(el) {
        return el != "" && el != null
    })

    // remove first element
    lineParts.shift()

    // get location information
    let locationInfo = lineParts[4]
    let locationFromCode = locationInfo.slice(0, 3)
    let locationToCode = locationInfo.slice(3, 6)
    let locationTo = getAirportNameFromCode(locationToCode, airports)
    let locationFrom = getAirportNameFromCode(locationFromCode, airports)
    return { lineParts, locationFrom, locationTo }
}