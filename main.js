let defaultText = `RP/XXXXDDDDD/XXXXDDDDD            IB/SU  DDMMMYY/HHMMZ   XXXXXX
1.NNNNNN/NNNNN NNNN MS
2.NNNNNN/NNNNN NNNN(CHD/DDMMMYY)
3.NNNNNN/NNNNN MR   4.NNNNNN/NNNNN MR
5.NNNNNN/NNNNN(CHD/DDMMMYY)
6  KL1234 R 11MMM 6 KRSAMS HK5          1212 0435   *1A/E*
7  KL1234 R 11MMM 6 KRSAMS HK5          1112 1440   *1A/E*
8  KL1234 T 11MMM 6 AMSKRS HK5          1215 1400   *1A/E*
9  KL1234 T 11MMM 6 AMSKRS HK5          1612 1945   *1A/E*`

document.getElementById("inputField").value = defaultText;


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
        parseLine(line, outputTablePassengers, outputTableFlights);
    }

}

function getAirportNameFromCode(code, airportdict) {
    for (let i = 0; i < airportdict.length; i++) {
        if (airportdict[i].iata == code) {
            return airportdict[i].name;
        }
    }
}



function parseLine(line, passengertable, flighttable) {

    // check if line is passenger information
    if (line.includes(".")) {

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

    } else if (!line.startsWith("RP")) { // check if line is flight information

        // split by space
        var lineParts = line.split(" ");
        lineParts = lineParts.filter(function(el) {
            return el != "" && el != null;
        });

        // remove first element
        lineParts.shift();

        // get location information
        let locationInfo = lineParts[4];
        let locationFromCode = locationInfo.slice(0, 3);
        let locationToCode = locationInfo.slice(3, 6);
        let locationTo = getAirportNameFromCode(locationToCode, airports);
        let locationFrom = getAirportNameFromCode(locationFromCode, airports);




        // flight information
        flighttable.append($('<tr>')
            .append($('<td>').text(lineParts[0]))
            .append($('<td>').text(locationFrom))
            .append($('<td>').text(locationTo))
            .append($('<td>').text(lineParts[2]))
            .append($('<td>').text(lineParts[6]))
            .append($('<td>').text(lineParts[7]))
            .append($('<td>').text(lineParts[8])));
    }
}