/* eslint-disable */
export function getDefaultParametersForApiUrl(url) {
    switch (url) {
        case "http://dsevnbackend.ecoit.vn/api/HtNhaMay/getHtNMByTenTatTct":
            return {
                code: "EVNHANOI",
            };

        case "http://10.8.56.121:1997/baocaochuky/get-phutai-mien-IAH":
        case "http://10.8.56.121:1997/baocaochuky/get-phutai-mien-SCADA-30P":
        case "http://10.8.56.121:1997/baocaochuky/get-phutai-mien-SCADA-5P":
        case "http://10.8.56.121:1997/baocaochuky/get-thuydiennho-mien-IAH":
        case "http://10.8.56.121:1997/baocaochuky/get-rooftop-mien-IAH":
        case "http://10.8.56.121:1997/baocaochuky/get-muatq-IAH":
        case "http://10.8.56.121:1997/baocaochuky/get-sgncdt-thoigiannhanca":
        case "http://10.8.56.121:1997/huydongnguon/get-congsuathuydong-tomay-IAH":
        case "http://10.8.56.121:1997/huydongnguon/get-congsuathuydong-tomay-SCADA-48CK":
            return {
                tu_ngay: "01/01/2024",
                den_ngay: new Date().toLocaleDateString()
            };

        case "http://10.8.56.121:1997/baocaochuky/get-sosanh-laplich-dah-iah":
            return {
                tu_ngay: "01/01/2024",
                den_ngay: new Date().toLocaleDateString(),
                chuky: 1,
            };

        default:
            return null;
    }
}

function getPropertiesForResponse(url) {
    switch (url) {
        case "http://dsevnbackend.ecoit.vn/api/HtNhaMay/getHtNMByTenTatTct":
            return ["id", "tenNm", "maNm", "tentatNm", "tennhamay", "checkPM"];

        case "https://my-json-server.typicode.com/typicode/demo/posts":
            return ["id", "title"];

        case "https://my-json-server.typicode.com/typicode/demo/profile":
            return ["name"];

        case "https://my-json-server.typicode.com/typicode/demo/comments":
            return ["id", "body", "postId"];

        case 'http://10.8.56.121:1997/baocaochuky/get-phutai-mien-IAH':
            return ["NGAY", "TEN_NODE", "ID_NODE", "H1"];

        case 'http://10.8.56.121:1997/baocaochuky/get-phutai-mien-SCADA-30P':
        case 'http://10.8.56.121:1997/baocaochuky/get-phutai-mien-SCADA-5P':
            return ["TEN_NODE", "ID_NODE", "NGAY", "GIO", "PHUT", "CHUKY", "PHUTAI_KNN", "PHUTAI_NGUONNHO", "PHUTAI_MT_MAINHA", "PHUTAI_XNK"];

        case 'http://10.8.56.121:1997/baocaochuky/get-thuydiennho-mien-IAH':
        case 'http://10.8.56.121:1997/baocaochuky/get-rooftop-mien-IAH':
            return ["NGAY", "ID_NODE", "H1"];

        case 'http://10.8.56.121:1997/baocaochuky/get-muatq-IAH':
            return ["NGAY", "TENTAT_XNK", "H1"];

        case 'http://10.8.56.121:1997/baocaochuky/get-sgncdt-thoigiannhanca':
            return ["DDV", "NHANCA", "ID_CATRUC"];

        case 'http://10.8.56.121:1997/baocaochuky/get-sosanh-laplich-dah-iah':
            return ["TENNHAMAY", "TEN_TM", "ID_TM", "NGAY", "CHUKY", "DAH", "IAH"];
        
        case 'http://10.8.56.121:1997/baocaochuky/get-danhsach-nhamay-smhp':
        case 'http://10.8.56.121:1997/baocaochuky/get-danhsach-nhamay-bot':
        case 'http://10.8.56.121:1997/baocaochuky/get-danhsach-nhamay-ngoaitt':
            return ["ID_TM", "ID_NM", "TENNHAMAY", "LOAIHINHTTD"];
        
        case 'http://10.8.56.121:1997/huydongnguon/get-congsuathuydong-tomay-IAH':
            return ["NGAY", "TENNHAMAY", "ID_NM", "TEN_TM", "ID_TM", "H1"];
        
        case 'http://10.8.56.121:1997/huydongnguon/get-congsuathuydong-tomay-SCADA-48CK':
            return ["ID_TM", "TENNHAMAY", "TENTOMAY", "H1"];

        default:
            return [];
    }
}

function getHeadersForApiUrl(url) {
    switch (url) {
        case "http://dsevnbackend.ecoit.vn/api/HtNhaMay/getHtNMByTenTatTct":
            return {
                authorization:
                    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJFQ08tRFNUVCIsImp0aSI6IjI2YzlkY2VhLWUwZTEtNDMxYy1hYTNlLTQwOTBjODI4ZTA1YyIsImlhdCI6IjMvOC8yMDI0IDE6NTA6MzIgQU0iLCJJRCI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW4iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJhZG1pbkBnbWFpbC5jb201NCIsIm5iZiI6MTcwOTg2MjYzMiwiZXhwIjoxNzA5OTQ5MDMyLCJpc3MiOiJFY29JVCIsImF1ZCI6IkVWTiJ9.rqCp6LacCoYZYbQiEyhfGIH210Ig5IMZ5T-EfVkOS9s",
            };

        default:
            return null;
    }
}

function getResponseMainProperty(url) {
    switch (url) {
        case "http://dsevnbackend.ecoit.vn/api/HtNhaMay/getHtNMByTenTatTct":
            return "data";

        default:
            return "";
    }
}

function getParametersText(parameters) {
    let paramText = "";
    if (parameters && typeof parameters === "object") {
        for (const param in parameters) {
            paramText += `&${param}=${parameters[param]}`;
        }
    }
    paramText = paramText.replace("&", "?");
    paramText = paramText.replaceAll("/", "%2F");
    return paramText;
}

function getResponsePropertyText(properties) {
    let cols = `[{
        id: "id",
        dataType: tableau.dataTypeEnum.string
    }, {
        id: "body",
        dataType: tableau.dataTypeEnum.string
    }, {
        id: "postId",
        dataType: tableau.dataTypeEnum.string
    }]`;
    let tableRow = `
      "id": data[i].id,
      "body": data[i].body,
      "postId": data[i].postId  
    `;    
    if (properties && properties.length) {
        cols = "[";
        tableRow = "";
        properties.forEach((prop) => {
            if (prop === 'H1') {
                for (let i = 1; i <= 48; i++) {
                    cols += `{
                        id: "H${i}",
                        dataType: tableau.dataTypeEnum.string,
                    },`;
                    tableRow += `"H${i}": data[i].H${i},`;
                }
            } else {
                cols += `{
                    id: "${prop}",
                    dataType: tableau.dataTypeEnum.string,
                },`;
                tableRow += `"${prop}": data[i].${prop},`;
            }
        });
        cols += "]";
    }

    return { cols, tableRow };
}

export function getDOMText(url, parameters) {
    const properties = getPropertiesForResponse(url);
    const headers = getHeadersForApiUrl(url);
    const responseProperty = getResponseMainProperty(url);
    const paramText = getParametersText(parameters);

    const { cols, tableRow } = getResponsePropertyText(properties);
    let headerText = "";
    // if (authToken) {
    //     headerText = `authorization: "${authToken}"`
    // }

    if (headers) {
        for (const property in headers) {
            headerText += `"${[property + ""]}": "${headers[property]}",`;
        }
    }

    return `
    <html>
    <head>
        <title>USGS</title>
        <meta http-equiv="Cache-Control" content="no-store" />
        
        <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js" type="text/javascript"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>
        
        <script src="https://connectors.tableau.com/libs/tableauwdc-2.3.latest.js" type="text/javascript"></script>
    </head>
    
    <body>
        <div class="container container-table">
            <div class="row vertical-center-row">
                <div class="text-center col-md-4 col-md-offset-4">
                    <button type = "button" id = "submitButton" class = "btn btn-success" style = "margin: 10px;">Get Earthquake Data!</button>
                </div>
            </div>
        </div>
        
        <script>
    (function() {
        // Create the connector object
        var myConnector = tableau.makeConnector();
    
        // Define the schema
        myConnector.getSchema = function(schemaCallback) {
            var cols = ${cols}
    
            var tableSchema = {
                id: "evn",
                alias: "EVN",
                columns: cols
            };
    
            schemaCallback([tableSchema]);
        };
    
        // Download the data
        myConnector.getData = function(table, doneCallback) {
            $.ajax({
                url: "${url + paramText}", 
                headers: {
                    ${headerText
                        ? headerText
                        : ""}
                    'Access-Control-Allow-Origin': '*'
                },
                success: function(resp) {
                    var data = ${
                        responseProperty ? `resp.${responseProperty}` : "resp"
                    },
                        tableData = [];
    
                    // Iterate over the JSON object
                    if (Array.isArray(data)) {
                      for (var i = 0, len = data.length; i < len; i++) {
                          tableData.push({
                            ${tableRow}
                          });
                      }
                    } else if (typeof data === 'object') {
                      for (const property in data) {
                        tableData.push({
                          [property+'']: data[property]
                        });
                      }
                    }
    
                    table.appendRows(tableData);
                    doneCallback();
                }
            });
        };
    
        tableau.registerConnector(myConnector);
    
        // Create event listeners for when the user submits the form
        $(document).ready(function() {
            // $("#submitButton").click(function() {
            setTimeout(() => {
                tableau.connectionName = "evn"; // This will be the data source name in Tableau
                tableau.submit(); // This sends the connector object to Tableau
            }, 1000);
            // });
        });
    })();
        </script>
    </body>
    </html>  
    `;
}

// export async function loginToGetToken(userName, password) {
//     const response = await fetch(
//         "http://dsevnbackend.ecoit.vn/api/users/login",
//         {
//             method: "POST",
//             headers: {
//                 'Content-Type': "application/json; charset=utf-8",
//                 'Accept': '*/*',
//                 'Accept-Encoding': 'gzip, deflate, br',
//                 'Connection': 'keep-alive'
//             },
//             body: JSON.stringify({
//                 userName,
//                 password
//             })
//         }
//     );   
//     const data = await response.json();

//     return data.data.tokenInfo;
// }