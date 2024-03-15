import Cookie from 'js-cookie';
import queryString from 'querystring';

const defaultDOMText = `
<html>
<head>
    <title>USGS</title>
    <meta http-equiv="Cache-Control" content="no-store" />
    
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js" type="text/javascript"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>
    
    <script src="https://connectors.tableau.com/libs/tableauwdc-2.3.latest.js" type="text/javascript"></script>
    <script src="../js/demo.js" type="text/javascript"></script>
</head>

<body>
    <div class="container container-table">
        <div class="row vertical-center-row">
            <div class="text-center col-md-4 col-md-offset-4">
                <button type = "button" id = "submitButton" class = "btn btn-success" 
                style = "margin: 10px;">Get Earthquake Data!</button>
            </div>
        </div>
    </div>
</body>
</html>
`;

// Set Class Constants
export const eventNames = {
  LOADED: 'loaded',
  LOG: 'log',
  INIT: 'init',
  INIT_CB: 'initCallback',
  SUBMIT: 'submit',
  SCHEMA_GET: 'getSchema',
  SCHEMA_CB: '_schemaCallback',
  DATA_GET: 'getData',
  DATA_CB: '_tableDataCallback',
  DATA_DONE_CB: '_dataDoneCallback',
  SHUTDOWN: 'shutdown',
  SHUTDOWN_CB: 'shutdownCallback',
  ABORT: 'abortWithError',
  ABORT_AUTH: 'abortForAuth',
  REPORT_PROGRESS: 'reportProgress',
};

export const phases = {
  INTERACTIVE: 'interactive',
  AUTH: 'auth',
  GATHER_DATA: 'gatherData',
};

export const defaultWdcAttrs = {
  connectionName: '',
  connectionData: '',
  username: '',
  password: '',
  usernameAlias: '',
  platformOs: '',
  platformEdition: '',
  platformVersion: '',
  platformBuildNumber: '',
  authPurpose: 'ephemeral',
  locale: 'en-us',
};

// Used for Join Filtering advanced feature
export const defaultFilterInfo = {
  selectedTable: '',
  selectedColumn: '',
  selectedFK: '',
};

// export const defaultShowAdvanced = Cookie.getJSON('showAdvanced') || false;
export const defaultShowAdvanced = false;

export const samples = [
  '../Examples/html/demo.html',
  '../Examples/html/earthquakeUSGS.html',
  '../Examples/html/earthquakeMultitable.html',
  '../Examples/html/earthquakeMultilingual.html',
  '../Examples/html/IncrementalRefreshConnector.html',
  '../Examples/html/JoinFilteringExample.html',
];
export const apiUrls = [
  'http://dsevnbackend.ecoit.vn/api/HtNhaMay/getHtNMByTenTatTct',
  'https://my-json-server.typicode.com/typicode/demo/posts',
  'https://my-json-server.typicode.com/typicode/demo/comments',
  'https://my-json-server.typicode.com/typicode/demo/profile',
  'http://3.3.251.100:8000/baocaochuky/get-phutai-mien-IAH',
  'http://3.3.251.100:8000/baocaochuky/get-phutai-mien-SCADA-30P',
  // 'http://3.3.251.100:8000/baocaochuky/get-phutai-mien-SCADA-5P',
  'http://3.3.251.100:8000/baocaochuky/get-thuydiennho-mien-IAH',
  'http://3.3.251.100:8000/baocaochuky/get-rooftop-mien-IAH',
  'http://3.3.251.100:8000/baocaochuky/get-muatq-IAH',
  'http://3.3.251.100:8000/baocaochuky/get-sgncdt-thoigiannhanca',
  'http://3.3.251.100:8000/baocaochuky/get-sosanh-laplich-dah-iah',
  'http://3.3.251.100:8000/baocaochuky/get-danhsach-nhamay-smhp',
  'http://3.3.251.100:8000/baocaochuky/get-danhsach-nhamay-bot',
  'http://3.3.251.100:8000/baocaochuky/get-danhsach-nhamay-ngoaitt',
  'http://3.3.251.100:8000/baocaochuky/get-congsuathuydong-tomay-IAH',
  'http://3.3.251.100:8000/baocaochuky/get-congsuathuydong-tomay-SCADA-48CK',
];

// export const defaultMostRecentUrls = Cookie.getJSON('mostRecentUrls') || [...samples];
export const defaultMostRecentUrls = [...samples];

// if a src query was specified, use it, else use the first MRU
// use a src query if one exists
const srcQuery = typeof location !== 'undefined' ?
  queryString.parse(location.search.slice(1)).src : null;

export const defaultUrl = srcQuery || [...defaultMostRecentUrls][0];
export const defaultApi = apiUrls[0];

export const WINDOW_PROPS = 'height=500,width=800';

export const defaultState = {
  // Originally wdcProps, renamed to avoid confusion with component props
  wdcAttrs: defaultWdcAttrs,
  filterInfo: defaultFilterInfo,
  activeJoinFilter: null,
  addressBarUrl: defaultUrl,
  wdcUrl: defaultUrl,
  mostRecentUrls: defaultMostRecentUrls,
  showAdvanced: defaultShowAdvanced,
  wdcShouldFetchAllTables: true,
  shouldHaveGatherDataFrame: false,
  currentPhase: phases.INTERACTIVE,
  phaseInProgress: false,
  phaseSubmitCalled: false,
  phaseInitCallbackCalled: false,
  simulatorWindow: null,
  tables: {},
  standardConnections: [],
  apiUrl: defaultApi,
  apiUrls,
  iframeDOM: defaultDOMText,
  apiParameters: { code: 'EVNHANOI' },
};

export const visOptions = {
  layout: {
    hierarchical: { direction: 'LR' },
  },
  nodes: {
    borderWidth: 8,
    borderWidthSelected: 12,
    color: {
      border: '#e1e1e1',
      background: '#e1e1e1',
      highlight: '#2dcc97',
      hover: '#cbcbcb',
    },
    font: { color: '#000000' },
    shape: 'box',
    shapeProperties: { borderRadius: 0 },
  },
  edges: {
    color: {
      color: '#355c80',
      highlight: '#2dcc97',
      hover: '#00b180',
    },
    smooth: {
      enabled: true,
      type: 'cubicBezier',
      roundness: 0.6,
    },
  },
  interaction: {
    hover: true,
    zoomView: false,
  },
};
