/* eslint-disable */
import Cookie from 'js-cookie';
import { createAction } from 'redux-actions';
import { cleanUrl } from '../utils/misc';
import * as consts from '../utils/consts';

// Redux action creator functions
// more info can be found here:
// http://redux.js.org/docs/basics/Actions.html

// Conventional Actions
// Wdc Actions
export const setWdcShouldFetchAllTables = createAction('SET_WDC_SHOULD_FETCH_ALL_TABLES');
export const setWdcAttrs = createAction('SET_WDC_ATTRS');
export const setFilterInfo = createAction('SET_FILTER_INFO');
export const setActiveJoinFilter = createAction('SET_ACTIVE_JOIN_FILTER');
export const setAddressBarUrl = createAction('SET_ADDRESS_BAR_URL');
export const setApiUrl = createAction('SET_API_URL');
export const setWdcUrl = createAction('SET_WDC_URL');
export const setMostRecentUrls = createAction('SET_MOST_RECENT_URLS');
export const setApiUrls = createAction('SET_API_URLS');
export const setIframeDOM = createAction('SET_IFRAME_DOM');
export const setApiParameters = createAction('SET_API_PARAMETERS');

// Phase Actions
export const setCurrentPhase = createAction('SET_CURRENT_PHASE');
export const setPhaseInProgress = createAction('SET_PHASE_IN_PROGRESS');
export const setPhaseInitCallbackCalled = createAction('SET_PHASE_INIT_CALLBACK_CALLED');
export const setPhaseSubmitCalled = createAction('SET_PHASE_SUBMIT_CALLED');

// Window Actions
export const setSimulatorWindow = createAction('SET_SIMULATOR_WINDOW');
export const setShouldHaveGatherDataFrame = createAction('SET_SHOULD_HAVE_GATHER_DATA_FRAME');

// Table Actions
export const setTables = createAction('SET_TABLES');
export const addTables = createAction('ADD_TABLES');

// Standard Connection Actions
export const setStandardConnections = createAction('SET_STANDARD_CONNECTIONS');

// Advanced UI Actions
export const setShowAdvanced = createAction('SET_SHOW_ADVANCED', (show) => {
  Cookie.set('showAdvanced', show);
  return show;
});

// Reset Actions
export const resetState = createAction('RESET_STATE', () => {
  const mostRecentUrls = Cookie.getJSON('mostRecentUrls') || consts.samples;
  // copy mostRecentUrls to sever references
  const addressBarUrl = [...mostRecentUrls][0];
  const apiUrls = consts.apiUrls;
  const apiUrl = apiUrls[0];
  return { ...consts.defaultState, addressBarUrl, mostRecentUrls, apiUrl, apiUrls };
});

export const resetPhaseState = createAction('RESET_PHASE_STATE');
export const resetWdcAttrs = createAction('RESET_WDC_ATTRS');
export const resetTables = createAction('RESET_TABLES');
export const resetTableData = createAction('RESET_TABLE_DATA');
export const resetStandardConnections = createAction('RESET_STANDARD_CONNECTIONS');


// Thunks (and Composed Actions)
// More info can be found here:
// https://github.com/gaearon/redux-thunk

// Phase Control Thunks
export function startConnector(phase) {
  return (dispatch) => {
    // Clean up simulator and get ready for starting connector
    dispatch(resetTables());
    dispatch(resetStandardConnections());
    dispatch(setCurrentPhase(phase));
    dispatch(setPhaseInProgress(true));
    dispatch(commitUrl());
    dispatch(closeSimulatorWindow());
    dispatch(setWindowAsExternal());
    // dispatch(fetchUrl());
  };
}

export function startGatherDataPhase() {
  return (dispatch) => {
    // Start Data Gather Phase, close interactive window,
    // open iframe
    dispatch(setCurrentPhase(consts.phases.GATHER_DATA));
    dispatch(setPhaseInProgress(true));
    dispatch(closeSimulatorWindow());
    dispatch(setShouldHaveGatherDataFrame(true));
  };
}

// Simulator Window Thunks
// Opens a window for the wdc and sets it as the window we will
// be using for communication with the wdc. Used in the interactive and auth phases
export function setWindowAsExternal() {
  return (dispatch, getState) => {
    // const { wdcUrl } = getState();
    // const simulatorWindow = window.open(wdcUrl, 'wdc', consts.WINDOW_PROPS);
    const simulatorWindow = window.open('', 'wdc', consts.WINDOW_PROPS);
    const { apiUrl, apiParameters } = getState();
    dispatch(setSimulatorWindow(simulatorWindow));
    dispatch(setIframeDOM(getDOMText(apiUrl, apiParameters)));
    dispatch(appendJSToNewWindow());
  };
}

// Gets a ref to the iframe we open during the data gather phase
// and set's its content window as the window we will be using to
// communicate with the wdc. Acts as the headless browser used
// in the desktop version of the connector lifecycle
export function setWindowAsGatherFrame(iframe) {
  return (dispatch) => {
    //ref function might be called by react without a valid reference
    if (!!iframe) {
      dispatch(setSimulatorWindow(iframe.contentWindow));
    }
  };
}

// Note that the simulatorWindow points to an external window in
// the Interactive phase and the gather data iframe in the
// Gather Data phase
export function closeSimulatorWindow() {
  return (dispatch, getState) => {
    const { simulatorWindow } = getState();
    if (simulatorWindow) {
      simulatorWindow.close();
    }

    dispatch(setShouldHaveGatherDataFrame(false));
    dispatch(setSimulatorWindow(null));
  };
}


//Address Bar Thunks
export function commitUrl() {
  return (dispatch, getState) => {
    // Commit url changes once we are sure the user is done
    let updatedUrls;
    const { addressBarUrl, mostRecentUrls } = getState();
    const urlIndex = mostRecentUrls.indexOf(addressBarUrl);
    const cleanedUrl = cleanUrl(addressBarUrl);

    if (urlIndex === -1) {
      updatedUrls = [cleanedUrl, ...mostRecentUrls].slice(0, -1);
    } else {
      // copy mostRecentUrls to sever references
      updatedUrls = [...mostRecentUrls];
      updatedUrls.splice(urlIndex, 1);
      updatedUrls = [cleanedUrl, ...updatedUrls];
    }

    Cookie.set('mostRecentUrls', updatedUrls);
    dispatch(setWdcUrl(cleanedUrl));
    dispatch(setAddressBarUrl(cleanedUrl));
    dispatch(setMostRecentUrls(updatedUrls));
  };
}

export function appendJSToNewWindow() {
  return (_, getState) => {
    const { simulatorWindow, apiUrl } = getState();
    simulatorWindow.document.open();
    simulatorWindow.document.writeln(getDOMText(apiUrl, apiParameters));
    simulatorWindow.document.close();
    // simulatorWindow.onload = function(e) {
        // setTimeout(() => {
          // (fetchUrl.bind(simulatorWindow))(apiUrl);
        // },5000);
    // };
  }
}

export function fetchUrl(wdcUrl) {
    // Create the connector object
    let myConnector = this.tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        let cols = [{
            id: "id",
            dataType: this.tableau.dataTypeEnum.string
        }, {
            id: "body",
            dataType: this.tableau.dataTypeEnum.string
        }, {
            id: "postId",
            dataType: this.tableau.dataTypeEnum.string
        }];

        let tableSchema = {
            id: "evn",
            alias: "EVN",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.ajax({
            url: 'https://my-json-server.typicode.com/typicode/demo/db', 
            headers: {
                'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJFQ08tRFNUVCIsImp0aSI6IjZhZjQ4OTRjLTZkODktNDYyMS1iY2IyLWViNWU1OTBhZTliOCIsImlhdCI6IjMvNS8yMDI0IDExOjIyOjQzIEFNIiwiSUQiOiIxIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6ImFkbWluIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZW1haWxhZGRyZXNzIjoiYWRtaW5AZ21haWwuY29tNTQiLCJuYmYiOjE3MDk2Mzc3NjMsImV4cCI6MTcwOTcyNDE2MywiaXNzIjoiRWNvSVQiLCJhdWQiOiJFVk4ifQ.aJtO2fyuB7-iu940Xd2wmxbvua7MQsajz7-P4SCxE-8'
            },
            success: function(resp) {
                let data = resp.data.comments,
                    tableData = [];

                // Iterate over the JSON object
                for (let i = 0, len = data.length; i < len; i++) {
                    tableData.push({
                        "tenNm": data[i].id,
                        "maNm": data[i].body,
                        "tentatNm": data[i].postId
                    });
                }

                table.appendRows(tableData);
                doneCallback();
            }
        });
    };

    this.tableau.registerConnector(myConnector);

    if (this.document.querySelector('#submitButton')) {
      this.document.querySelector('#submitButton').onclick = (function() {
        this.tableau.connectionName = "EVNHANOI"; // This will be the data source name in this.Tableau
        this.tableau.submit(); // This sends the connector object to Tableau
      }).bind(this);
    }
}

export function getDefaultParametersForApiUrl (url) {
  switch (url) {
    case 'http://dsevnbackend.ecoit.vn/api/HtNhaMay/getHtNMByTenTatTct':
      return {
        code: 'EVNHANOI'
      };
  
    default:
      return null;
  }
}

function getPropertiesForResponse (url) {
  switch (url) {
    case "http://dsevnbackend.ecoit.vn/api/HtNhaMay/getHtNMByTenTatTct?code=EVNHANOI":
      return ["id", "tenNm", "maNm", "tentatNm", "tennhamay", "checkPM"];

    case "https://my-json-server.typicode.com/typicode/demo/posts":
      return ["id", "title"];
  
    case "https://my-json-server.typicode.com/typicode/demo/profile":
      return ["name"];

    case "https://my-json-server.typicode.com/typicode/demo/comments":
      return ["id", "body", "postId"]

    default:
      return [];
  }
}

function getHeadersForApiUrl (url) {
  switch (url) {
    case 'http://dsevnbackend.ecoit.vn/api/HtNhaMay/getHtNMByTenTatTct?code=EVNHANOI':
      return {
        authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJFQ08tRFNUVCIsImp0aSI6ImU0NzdmOTYyLTRlYmItNGIxMS1hYmRlLWU3YmVlOWIwZTZiMiIsImlhdCI6IjMvNy8yMDI0IDg6NTI6MDEgQU0iLCJJRCI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW4iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJhZG1pbkBnbWFpbC5jb201NCIsIm5iZiI6MTcwOTgwMTUyMSwiZXhwIjoxNzA5ODg3OTIxLCJpc3MiOiJFY29JVCIsImF1ZCI6IkVWTiJ9.eszt2S_Guv3jPjMzWf5VcBbWlkZopwVeOt9mSqLtuQU'
      };
    
    default:
      return null;
  }
}

function getResponseProperty (url) {
  switch (url) {
    case 'http://dsevnbackend.ecoit.vn/api/HtNhaMay/getHtNMByTenTatTct?code=EVNHANOI':
      return 'data';    
  
    default:
      return '';
  }
}

function getParametersText (parameters) {
  let paramText = '';
  if (parameters && typeof parameters === 'string') {
    for (const param in parameters) {
      paramText += `&${param}=${parameters[param]}`
    }
  }
  paramText[0] = '?';
  return paramText;
}

export function getDOMText(url, parameters) {
  const properties = getPropertiesForResponse(url);
  const headers = getHeadersForApiUrl(url);
  const responseProperty = getResponseProperty(url);
  const paramText = getParametersText(parameters);

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
  let headerText = '';

  if (properties && properties.length) {
    cols = '[';
    tableRow = '';
    properties.forEach((prop) => {
      cols += `{
        id: "${prop}",
        dataType: tableau.dataTypeEnum.string,
      },`;
      tableRow += `"${prop}": data[i].${prop},`;
    });
    cols += ']';
  }

  if (headers) {
    for (const property in headers) {
      headerText += `"${[property+'']}": "${headers[property]}",`
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
              ${headerText 
                ? `headers: {
                  ${headerText}
                },`
                : ''
              }
              success: function(resp) {
                  /* eslint-disable-next-line */
                  console.log('========== resp ', resp);
                  /* eslint-disable-next-line */
                  debugger;
                  var data = ${responseProperty ? `resp.${responseProperty}` : 'resp'},
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
          $("#submitButton").click(function() {
              tableau.connectionName = "evn"; // This will be the data source name in Tableau
              tableau.submit(); // This sends the connector object to Tableau
          });
      });
  })();
      </script>
  </body>
  </html>  
  `;
}
