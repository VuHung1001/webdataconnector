import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FormGroup,
  FormControl,
  InputGroup,
  MenuItem,
  DropdownButton,
  ControlLabel } from 'react-bootstrap';

//----------------------Address Bar---------------------//
// Component with the UI elements necessary to update the
// state of addressBarUrl
//------------------------------------------------------//

class AddressBar extends Component {
  constructor(props) {
    super(props);
    this.handleAddressBarUrlInput = this.handleAddressBarUrlInput.bind(this);
    this.handleAddressBarUrlSelect = this.handleAddressBarUrlSelect.bind(this);
    this.handleApiUrlInput = this.handleApiUrlInput.bind(this);
    this.handleApiUrlSelect = this.handleApiUrlSelect.bind(this);
  }

  handleAddressBarUrlInput(e) {
    this.props.setAddressBarUrl(e.target.value);
  }

  handleAddressBarUrlSelect(eventKey) {
    this.props.setAddressBarUrl(eventKey);
  }

  handleApiUrlInput(e) {
    this.props.setApiUrl(e.target.value);
  }

  handleApiUrlSelect(eventKey) {
    this.props.setApiUrl(eventKey);
    this.props.setApiParameters(eventKey);
  }

  render() {
    // const menuItems = this.props.mostRecentUrls.map((url, idx) =>
    //   <MenuItem
    //     eventKey={url}
    //     key={idx}
    //   >
    //     {url}
    //   </MenuItem>
    // );
    const menuItems = this.props.apiUrls.map((url, idx) =>
      <MenuItem
        eventKey={url}
        key={idx}
      >
        {url}
      </MenuItem>
    );

    return (
      <FormGroup>
        <ControlLabel> Connector URL </ControlLabel>
        <InputGroup>
          {/* <FormControl
            id="address-input"
            type="text"
            label="WDC URL"
            value={this.props.addressBarUrl}
            onChange={this.handleAddressBarUrlInput}
          />
          <DropdownButton
            id="most-recent-urls-custom"
            title="Recent"
            componentClass={InputGroup.Button}
            onSelect={this.handleAddressBarUrlSelect}
            pullRight
          >
            {menuItems}
          </DropdownButton> */}
          <FormControl
            id="address-input"
            type="text"
            label="WDC URL"
            value={this.props.apiUrl}
            onChange={this.handleApiUrlInput}
          />
          <DropdownButton
            id="most-recent-urls-custom"
            title="API URLS"
            componentClass={InputGroup.Button}
            onSelect={this.handleApiUrlSelect}
            pullRight
          >
            {menuItems}
          </DropdownButton>
        </InputGroup>
      </FormGroup>
    );
  }
}

AddressBar.prototypes = {
  addressBarUrl: PropTypes.string.isRequired,
  mostRecentUrl: PropTypes.arrayOf(PropTypes.string).isRequired,
  setAddressBarUrl: PropTypes.func.isRequired,
  apiUrl: PropTypes.string.isRequired,
  setApiUrl: PropTypes.func.isRequired,
  apiUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
  setApiParameters: PropTypes.func.isRequired,
};

export default AddressBar;
