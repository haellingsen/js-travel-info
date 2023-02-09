import json
import csv


def convert_csv_to_json(csv_file_path, json_file_path):
    # convert airports.csv to json and dump to file
    with open(csv_file_path, "r") as csv_file:
        csv_file = csv.DictReader(csv_file)
        json_contents = json.dumps([row for row in csv_file], indent=4)
        
        with open(json_file_path, mode="w") as json_file:
            json_file.write(json_contents)

def content_diff():
    # compare the contents of two files
    with open("airports.js", "r") as f1:
        with open("airports.json", "r") as f2:
            f1 = json.load(f1)
            f2 = json.load(f2)
            
            print(f1[:3])
            input()
            print(f2[:3])
            input()
                    
            match_count = 0
            missing_airport_name = []
            for f1_airport in f1:
                matched = False
                for f2_airport in f2:
                    if f1_airport["iata"] == f2_airport["iata"]:
                        matched = True
                        if not f2_airport["airport"]:
                            missing_airport_name.append(f2_airport["iata"])
                            if f1_airport["name"]:
                                print(f"Airport name f1 {f1_airport['name']} does not match airport name f2 {f2_airport['airport']}")
                                print(json.dumps(f1_airport, indent=4))
                                print(json.dumps(f2_airport, indent=4))
                                input()
                    
                if matched:
                    match_count += 1
                else:
                    print(f"Airport {f1_airport['iata']} not found in f2, appending to f2")
                    f2.append({
        "country_code": f1_airport.get("iso"),
        "region_name": "",
        "iata": f1_airport.get("iata"),
        "icao": "",
        "airport": f1_airport.get("name"),
        "latitude": f1_airport.get("lat"),
        "longitude": f1_airport.get("lon"),
    },)
            
            print(f"Length of f1: {len(f1)} and f2: {len(f2)}")
            print(f"Matched {match_count} out of {len(f1)} from f1, not existing in f2 are: {len(f1) - match_count}")
            print(f"Airport codes with missing airport names({len(missing_airport_name)}):\n {missing_airport_name}")
        
        if len(f1) - match_count > 0:
            print("Updating f2.")
            with open("airports.json", "w") as f2_writeable:
                print("Updating f2.")
                f2_writeable.write(json.dumps(f2, indent=4))




#convert_csv_to_json("airports.csv", "airports.json")
content_diff()
        

