// Inicializar el proveedor de credenciales de Amazon Cognito
AWS.config.region = 'us-east-1'; // Región
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:5f35d966-ac6d-44c4-8b0c-fba5162641af',
});

// Set up connection with DynamoDB.
var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();

//Refresh
let refresh = document.getElementById('refresh');
refresh.addEventListener('click', _ => {
            location.reload();
})

// List of stations in the Database.
var stations = new Set();

// Function that get the last value from the table.
// Since that the oldest value is the first of the list,
// I have to reverse this list and take the first tuple.
function getLatestValue() {

    // Parameters for the scan of the DB.
    var params = {
        ExpressionAttributeNames: {
            "#id": "id"
        },
        ProjectionExpression: '#id',
        TableName: 'ESTACION_SMART_AGRICULTURE_PRO'
    };

    docClient.scan(params, onScan);

    // Function that scans the table EnvironmentalStationDB,
    // then adds the ID of the stations in the list 'stations'
    function onScan(err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            data.Items.forEach(function (element) {
                stations.add(element.id);
            });
            stations = Array.from(stations);
            stations.sort();
            console.log("success", stations);
            stations.forEach(function (id) {
                //Parameters of the query.
                var params = {
                    TableName: "ESTACION_SMART_AGRICULTURE_PRO",
                    //ProjectionExpression: "#dtime, temperature, humidity, windDirection, windIntensity, rainHeight",
                    ProjectionExpression: "#dtime, hsoil, humedad, presion, temperatura",
                    KeyConditionExpression: "id = :stationId",
                    ExpressionAttributeNames: {
                        "#dtime": "datetime"
                    },
                    ExpressionAttributeValues: {
                        ":stationId": id
                    }
                };

                console.log("prova", id);


                //Query from each station.
                docClient.query(params, function (err, data) {
                    if (err) {
                        console.log("Error", err);
                    } else {

                        // In the variable 'latest' there will be the
                        // last value inserted in the DB.
                        // Since that the list is ordered from the oldest to
                        // the newest value, I have to reverse it.
                        var latest = data.Items.reverse()[0];
                        console.log("successE");
                        console.log(latest)

                        // Insert latest value for each sensor.
                        document.getElementById('latest-value1').innerHTML = latest.temperatura + ' °C';
						//document.getElementById('latest-value1-copy').innerHTML = latest.temperature + ' °C';
                        document.getElementById('latest-value2').innerHTML = latest.humedad + ' %';
                        document.getElementById('latest-value3').innerHTML = latest.temperatura + ' °C';
                        //document.getElementById('latest-value3').innerHTML = latest.rainHeight + ' %';
                        document.getElementById('latest-value4').innerHTML = latest.presion + ' Pa';
                        document.getElementById('latest-value5').innerHTML = latest.hsoil + ' Hz';
						//document.getElementById('latest-value4-copy').innerHTML = latest.soilMoisture + '%';
						
                        // para el caso de la humedad ambiental
						/*if(Number(latest.humidity) <= 40){
							document.getElementById('humidity-status').innerHTML = 'Seco';
							//console.log("seca");
						}else if(Number(latest.humidity) <= 60 ){
							document.getElementById('humidity-status').innerHTML = 'Óptimo';
							//console.log("llovizna");
						}else {
							document.getElementById('humidity-status').innerHTML = 'Muy húmedo';
							
						}*/
                        // para el caso de la dirección de viento
						/*if(Number(latest.windDirection) == 0){
							document.getElementById('wind-dir').innerHTML = 'Este';
							//console.log("seca");
						}else if(Number(latest.windDirection) <= 88 ){
							document.getElementById('wind-dir').innerHTML = 'Noreste';
							//console.log("llovizna");
						}else if(Number(latest.windDirection) <= 91 ){
							document.getElementById('wind-dir').innerHTML = 'Norte';
							//console.log("llovizna");
						}else if(Number(latest.windDirection) <= 178 ){
							document.getElementById('wind-dir').innerHTML = 'Noroeste';
							//console.log("llovizna");
						}else if(Number(latest.windDirection) <= 181 ){
							document.getElementById('wind-dir').innerHTML = 'Oeste';
							//console.log("llovizna");
						}else if(Number(latest.windDirection) <= 268 ){
							document.getElementById('wind-dir').innerHTML = 'Suroeste';
							//console.log("llovizna");
						}else if(Number(latest.windDirection) <= 271 ){
							document.getElementById('wind-dir').innerHTML = 'Sur';
							//console.log("llovizna");
						}else if(Number(latest.windDirection) <= 358 ){
							document.getElementById('wind-dirs').innerHTML = 'Sureste';
							//console.log("llovizna");
                        }else {
							document.getElementById('wind-dir').innerHTML = 'Este';
							
						}*/

                        // para el caso de la intensidad de viento
						/*if(Number(latest.windIntensity) <= 2){
							document.getElementById('wind-status').innerHTML = 'Calma';
							//console.log("seca");
						}else if(Number(latest.windIntensity) <= 6 ){
							document.getElementById('wind-status').innerHTML = 'Ventolina';
							//console.log("llovizna");
						}else if(Number(latest.windIntensity) <= 11 ){
							document.getElementById('wind-status').innerHTML = 'Brisa muy débil';
							//console.log("llovizna");
						}else if(Number(latest.windIntensity) <= 19 ){
							document.getElementById('wind-status').innerHTML = 'Brisa débil';
							//console.log("llovizna");
						}else if(Number(latest.windIntensity) <= 29 ){
							document.getElementById('wind-status').innerHTML = 'Brisa moderada';
							//console.log("llovizna");
						}else if(Number(latest.windIntensity) <= 39 ){
							document.getElementById('wind-status').innerHTML = 'Brisa fresca';
							//console.log("llovizna");
						}else if(Number(latest.windIntensity) <= 74 ){
							document.getElementById('wind-status').innerHTML = 'Viento fuerte';
							//console.log("llovizna");
						}else {
							document.getElementById('wind-status').innerHTML = 'Viento huracanado';
							
						}*/

						// para el caso de la lluvia
						/*if(Number(latest.rainHeight) == 0){
							document.getElementById('rain-status').innerHTML = 'Seca';
							//console.log("seca");
						}else if(Number(latest.rainHeight) <= 29 ){
							document.getElementById('rain-status').innerHTML = 'Lluvia ligera';
							//console.log("llovizna");
						}else if(Number(latest.rainHeight) <= 55 ){
							document.getElementById('rain-status').innerHTML = 'Lluvia moderada';
							//console.log("llovizna");
						}else if(Number(latest.rainHeight) <= 79 ){
							document.getElementById('rain-status').innerHTML = 'Lluvia fuerte';
							//console.log("llovizna");
						}else {
							document.getElementById('rain-status').innerHTML = 'Lluvia intensa';
							console.log("llovizna");
						}*/
                        var c;
                        var d;
                        // Change update on the cards.
                        /*for (c = 1; c < 6; c++) {       //previous value: 6
                            document.getElementById('update' + c).innerHTML = '<i class="material-icons">update</i> Actualizado ' + id;
                        }*/
                        for (d = 1; d < 6; d++) {       //previous value: 6
                            //console.log(d);
                            document.getElementById('update' + d).innerHTML = 'Estación ' + String(id) ;
                        }
                        // Compute the size of the table EnvironmentalStationDB
                        // (this variable serves for the next step)
                        //var sizeList = Object.keys(data.Items).length;
                        //console.log(sizeList);

                        // In the variable 'actual' there will be, for
                        // each iteration of the cycle, all the tuples
                        // from the newest to the oldest.
                        var actual = data.Items;

                        // Insert the latest 5 tuples for each station.
                        //for (c = 0; c < 5; c++) {
                          //  document.getElementById('station1').innerHTML += '<tr><td>' + actual[c].datetime + '</td><td>' + actual[c].temperature + '</td><td>' + actual[c].humidity +
                            //    '</td><td>' + actual[c].windDirection + '</td><td>' + actual[c].windIntensity + '</td><td>' + actual[c].rainHeight + '</td></tr> ';
                        //}
                        for (c = 0; c < 5; c++) {
                            document.getElementById('station' +id).innerHTML += '<tr><td>' + actual[c].datetime + '</td><td>' + actual[c].temperatura + '</td><td>' + actual[c].humedad + '</td><td>' + actual[c].presion + '</td><td>' + actual[c].hsoil + '</td></tr>';
							
                        }
						
                    }

                });
            });
        }
    };
}

// Function that returns the one hour ago from now.
function computeDiff(tupleDate) {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();

    var currentDateTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;

    const dateOneObj = new Date(dateOne);
    const dateTwoObj = new Date(currentDateTime);
    const milliseconds = Math.abs(dateTwoObj - dateOneObj);
    const hours = milliseconds / 36e5;

    return hours;
}

// Function that returns the current time.
// (it serves for the 'LastHour' query)
function getDateTime() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();

    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }
    if (hour < 10) {
        hour = '0' + hour;
    }
    if (minute < 10) {
        minute = '0' + minute;
    }
    if (second < 10) {
        second = '0' + second;
    }

    var dateTimeOneHour = year + '-' + month + '-' + day + ' ' + (hour - 1) + ':' + minute + ':' + second;

    return dateTimeOneHour;
}

// Function that returns all the tuples inserted
// at most one hour ago. For each sensor will
// be filled its own table.

function getLastHourData(sensor) {

    // Variable that contains the time, one hour ago.
    var lastHour = getDateTime();

    // Parameters for the scan of the DB.
    var params = {
        TableName: "ESTACION_SMART_AGRICULTURE_PRO",
        ProjectionExpression: "#dtime, #id, " + sensor,
        FilterExpression: "#dtime >= :lastHour",
        ExpressionAttributeNames: {
            "#id": "id",
            "#dtime": "datetime"

        },
        ExpressionAttributeValues: {
            ":lastHour": lastHour
        }
    };
    docClient.scan(params, onScan);

    function onScan(err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            var c;
            var items = data.Items;
            var sizeList = Object.keys(items).length;
            for (c = 0; c < sizeList; c++) {
                if (sensor === "temperatura")
                    document.getElementById('id' + sensor).innerHTML += '<tr><td>' + items[c].datetime + '</td><td>' + items[c].id + '</td><td class="text-primary">' + items[c].temperatura + '</td></tr> ';
                else if (sensor === "humedad")
                    document.getElementById('id' + sensor).innerHTML += '<tr><td>' + items[c].datetime + '</td><td>' + items[c].id + '</td><td class="text-primary">' + items[c].humedad + '</td></tr> ';
                /*else if (sensor === "windDirection")
                    document.getElementById('id' + sensor).innerHTML += '<tr><td>' + items[c].datetime + '</td><td>' + items[c].id + '</td><td class="text-primary">' + items[c].windDirection '</td></tr> ';*/
                else if (sensor === "presion")
                    document.getElementById('id' + sensor).innerHTML += '<tr><td>' + items[c].datetime + '</td><td>' + items[c].id + '</td><td class="text-primary">' + items[c].presion + '</td></tr> ';
                else if (sensor === "hsoil")
                    document.getElementById('id' + sensor).innerHTML += '<tr><td>' + items[c].datetime + '</td><td>' + items[c].id + '</td><td class="text-primary">' + items[c].hsoil + '</td></tr> ';
            }
        }
    };
}