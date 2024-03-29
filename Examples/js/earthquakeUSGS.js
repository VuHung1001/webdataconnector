(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "tenNm",
            alias: "ten nha may",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "maNm",
            alias: "ma nha may",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "tentatNm",
            alias: "ten tat may",
            dataType: tableau.dataTypeEnum.string
        }];

        var tableSchema = {
            id: "earthquakeFeed",
            alias: "Earthquakes with magnitude greater than 4.5 in the last seven days",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.ajax({
            url: "http://dsevnbackend.ecoit.vn/api/HtNhaMay/getHtNMByTenTatTct?code=EVNHANOI", 
            headers: {
                'authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJFQ08tRFNUVCIsImp0aSI6IjU5MzNiYjYwLTlhYWQtNDU3OS1iOWYwLTUzNzdkYTQxNTZkYyIsImlhdCI6IjMvNS8yMDI0IDE6NTQ6MDAgQU0iLCJJRCI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW4iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJhZG1pbkBnbWFpbC5jb201NCIsIm5iZiI6MTcwOTYwMzY0MCwiZXhwIjoxNzA5NjkwMDQwLCJpc3MiOiJFY29JVCIsImF1ZCI6IkVWTiJ9.0NdzOoebdPBbVinE5fo5IELS5vNRfBVngn591G_8mow`
            },
            success: function(resp) {
                var feat = resp.data,
                    tableData = [];

                // Iterate over the JSON object
                for (var i = 0, len = feat.length; i < len; i++) {
                    tableData.push({
                        "tenNm": feat[i].tenNm,
                        "maNm": feat[i].maNm,
                        "tentatNm": feat[i].tentatNm
                    });
                }

                table.appendRows(tableData);
                doneCallback();
            }
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "USGS Earthquake Feed"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
