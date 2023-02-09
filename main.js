let defaultText = `RP/XXXXDDDDD/XXXXDDDDD            IB/SU  DDMMMYY/HHMMZ   XXXXXX
1.NNNNNN/NNNNN NNNN MS
2.NNNNNN/NNNNN NNNN(CHD/DDMMMYY)
3.NNNNNN/NNNNN MR   4.NNNNNN/NNNNN MR
5.NNNNNN/NNNNN(CHD/DDMMMYY)
6  KL1234 R 11MMM 6 KRSAMS HK5          1212 0435   *1A/E*
7  KL1234 R 11MMM 6 KRSAMS HK5          1112 1440   *1A/E*
8  KL1234 T 11MMM 6 AMSKRS HK5          1215 1400   *1A/E*
9  KL1234 T 11MMM 6 AMSKRS HK5          1612 1945   *1A/E*`


let example_2 = `2  SK2983 O 20FEB 1 KRSCPH HK1  0500    0600 0715   *1A/E*
3  SK 539 O 20FEB 1 CPHMAN HK1  0730 3  0830 0930   *1A/E*
4  SK4608 U 22FEB 3 MANOSL HK1  1145 1  1245 1545   *1A/E*
5  SK 221 U 22FEB 3 OSLKRS HK1  1635    1705 1755   *1A/E*`

let example_3 = `3  KL1206 L 01NOV 3 KRSAMS HK2          0600 0730   *1A/E*

4  KL 623 Q 01NOV 3 AMSATL HK2          0935 1415   *1A/E*

5  KL5034 Q 01NOV 3 ATLFLL HK2       S  1540 1742   *1A/E*

6 HTL 1A HK2 FLL 01NOV-02NOV/EXPEDIA BOOKING RESIDENCE INN BY

  MARIOTT FFL AIRPORT AND CRUISE PORT

7 TUR 1A HK2 FLL 02NOV-11NOV/CELEBRITY CRUISES.ULITMATE

  SOUTHERN CARIBBEAN

8  ARNK

9  AA2492 B 11NOV 6 MIACUN HK2          1735 1935   *1A/E*

10 HTL 1A HK2 CUN 11NOV-18NOV/EXPEDIA BOOKING EXCELLENCE PLAYA

  MUJERES

11  KL 690 Q 18NOV 6 CUNAMS HK2          1700 0820+1 *1A/E*

12  KL1209 L 19NOV 7 AMSKRS HK2          1215 1340   *1A/E*`

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
        // get the four letters and put them in to the element with id  "outputReferenceNumber"
        var referenceNumber = line.substring(2, 7);
        $("#outputReferenceNumber").html(referenceNumber);
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
                .append($('<td>').text(lastname))
                .append($('<td>').text(birthDate)));

        }

    }
    
    if (/^\d{0,2}\s/.test(line)) { // check if line is flight information

        //var { lineParts, locationFrom, locationTo } = parseFlightLineOld(line)

        var flightInfo = parseFlightLine(line)

        // flight information
        flighttable.append($('<tr>')
            .append($('<td>').text(flightInfo.flight_no))
            .append($('<td>').text(flightInfo.location_from))
            .append($('<td>').text(flightInfo.location_to))
            .append($('<td>').text(flightInfo.flight_date))
            .append($('<td>').text(flightInfo.time_boarding))
            .append($('<td>').text(flightInfo.time_departure))
            .append($('<td>').text(flightInfo.time_arrival))
            .append($('<td>').text(flightInfo.class)));

        //             // flight information
        // flighttable.append($('<tr>')
        // .append($('<td>').text(lineParts[0]))
        // .append($('<td>').text(locationFrom))
        // .append($('<td>').text(locationTo))
        // .append($('<td>').text(lineParts[2]))
        // .append($('<td>').text(lineParts[6]))
        // .append($('<td>').text(lineParts[7]))
        // .append($('<td>').text(lineParts[8])));


        }
}

function parseFlightLineOld(line) {
    var lineParts = line.split(" ")
    lineParts = lineParts.filter(function (el) {
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
