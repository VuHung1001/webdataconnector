/* eslint-disable */
// import 'regenerator-runtime/runtime';
import Cookie from 'js-cookie';
import { createAction } from 'redux-actions';
import { cleanUrl } from '../utils/misc';
import * as consts from '../utils/consts';
import { download, getDOMText, getFormattedDate, loginToGetToken, replaceFileForEachAPI } from '../utils/simulator_actions_utils';

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
    // let authToken = '';
    dispatch(resetTables());
    dispatch(resetStandardConnections());
    dispatch(setCurrentPhase(phase));
    dispatch(setPhaseInProgress(true));
    dispatch(commitUrl());
    dispatch(closeSimulatorWindow());
    // if (phase === consts.phases.AUTH) {
    //   const { wdcAttrs } = getState();
    //   authToken = await loginToGetToken(wdcAttrs.username, wdcAttrs.password);
    // }
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
    const { apiUrl, apiParameters } = getState();
    const apiIndex = consts.apiUrls.indexOf(apiUrl);
    const correspondSample = consts.samples[apiIndex];
    const simulatorWindow = window.open(correspondSample, 'wdc', consts.WINDOW_PROPS);
    dispatch(setWdcUrl(correspondSample));
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
    // dispatch(setWdcUrl(cleanedUrl));
    dispatch(setAddressBarUrl(cleanedUrl));
    dispatch(setMostRecentUrls(updatedUrls));
  };
}

export function appendJSToNewWindow() {
  return (_, getState) => {
    const { simulatorWindow, iframeDOM, wdcUrl } = getState();
    // download('demo.html', iframeDOM);
    replaceFileForEachAPI(wdcUrl, iframeDOM);
    simulatorWindow.document.open();
    simulatorWindow.document.writeln(iframeDOM);
    simulatorWindow.document.close();
    // simulatorWindow.onload = function(e) {
        // setTimeout(() => {
          // (fetchUrl.bind(simulatorWindow))(apiUrl);
        // },5000);
    // };
  }
}

export function updateAllSampleFiles() {
  return (_, getState) => {
    for (const sample of consts.samples) {
      const sampleIndex = consts.samples.indexOf(sample);
      const apiUrl = consts.apiUrls[sampleIndex];
      const { apiParameters } = getState();
      const DOMText = getDOMText(apiUrl, apiParameters);
      replaceFileForEachAPI(sample, DOMText);
    }
  }
}