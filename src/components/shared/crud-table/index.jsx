import React, { Component } from "react";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import filterFactory from "react-bootstrap-table2-filter";
import { Button, Collapse, Dropdown, Form } from "react-bootstrap";
import ReactModal from "components/shared/modal";
import paginationFactory from "react-bootstrap-table2-paginator";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import cellEditFactory from "react-bootstrap-table2-editor";
import { clearForm, createGuid, getFormData } from "services/shared/form-data-helper";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";

export default class CrudTable extends Component {
  constructor() {
    super();
    this.state = {
      showModal: false,
      selectedUuids: [],
      addSectionOpen: false,
    };
  }

  onRemove = async () => {
    this.setState({ showModal: false });
    await this.props.onRemove(this.state.selectedUuids);
    this.setState({ selectedUuids: [] });
  };

  onRowSelect = (uuid, isSelected) => {
    let currentSelectedUuids = this.state.selectedUuids;
    if (isSelected) {
      currentSelectedUuids.push(uuid);
    } else {
      const indexOfUuid = currentSelectedUuids.findIndex((u) => u === uuid);
      if (indexOfUuid !== -1) {
        currentSelectedUuids.splice(indexOfUuid, 1);
      }
    }
    this.setState({ selectedUuids: currentSelectedUuids });
  };

  getAddSection = () => {
    if (this.props.data[0] === undefined || this.props.data[0] === null) {
      return;
    }

    return Object.getOwnPropertyNames(this.props?.data[0])
      .filter((prop) => prop !== "uuid")
      .map((prop, index) => (
        <Form.Control required key={`${this.props.id}-form-items${index}`} className="mt-1 mb-1" name={prop} placeholder={prop} />
      ));
  };

  onAdd = (e) => {
    e.preventDefault();
    let formData = getFormData(`${this.props.id}-form`);
    formData.uuid = createGuid();
    clearForm(`${this.props.id}-form`);
    this.props.onAdd(formData);
  };

  render() {
    const selectRow = {
      mode: "checkbox",
      onSelect: (row, isSelect) => this.onRowSelect(row.uuid, isSelect),
      onSelectAll: (isSelect, rows) =>
        isSelect ? this.setState({ selectedUuids: rows.map((row) => row.uuid) }) : this.setState({ selectedUuids: [] }),
    };

    const { SearchBar } = Search;
    const paginatorOptions = {
      sizePerPageList: [
        {
          text: "5",
          value: 5,
        },
        {
          text: "10",
          value: 10,
        },
        {
          text: "25",
          value: 25,
        },
        {
          text: "50",
          value: 50,
        },
        {
          text: "200",
          value: 200,
        },
        {
          text: "Alles",
          value: this.props.data.length,
        },
      ],
    };

    return (
      <div>
        <ReactModal
          showModal={this.state.showModal}
          title={`${this.state.selectedUuids.length > 1 ? "items" : "item"} verwijderen`}
          description={this.state.selectedUuids.length > 1 ? "Items verwijderen?" : "Item verwijderen"}
        >
          <Button variant="danger" onClick={() => this.onRemove()}>
            Verwijderen
          </Button>
          <Button variant="secondary" onClick={() => this.setState({ showModal: false })}>
            Annuleren
          </Button>
        </ReactModal>
        <div className="content">
          <label
            hidden={!this.props?.addEnabled}
            style={{ cursor: "pointer" }}
            onClick={() => this.setState({ addSectionOpen: !this.state.addSectionOpen })}
          >
            Toevoegen {this.state.addSectionOpen ? <i className="fas fa-sort-up" /> : <i className="fas fa-sort-down" />}
          </label>
          <Collapse in={this.state.addSectionOpen}>
            <Form onSubmit={this.onAdd} className="mb-2" id={`${this.props.id}-form`}>
              <Form.Group>
                <Form.Label>Item toevoegen</Form.Label>
                {this.getAddSection()}
              </Form.Group>
              <Button variant="light" type="submit">
                <i className="fas fa-plus" /> Toevoegen
              </Button>
            </Form>
          </Collapse>

          <div hidden={this.state.selectedUuids.length === 0}>
            <label>
              {this.state.selectedUuids.length > 1
                ? `Opties voor geselecteerde rijen (${this.state.selectedUuids.length})`
                : "Opties voor geselecteerde rij"}
            </label>
            <Dropdown className="d-inline-block ml-2">
              <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                <li className="fas fa-pen" />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => this.setState({ showModal: true })}>Verwijderen</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <ToolkitProvider keyField="uuid" data={this.props.data} columns={this.props.columns} search>
            {(props) => (
              <div>
                <SearchBar {...props.searchProps} />
                <BootstrapTable
                  responsive
                  filter={filterFactory()}
                  cellEdit={cellEditFactory({
                    mode: "click",
                    afterSaveCell: (oldValue, newValue, row) => this.props.onSave(oldValue, newValue, row),
                  })}
                  keyField="uuid"
                  selectRow={selectRow}
                  pagination={paginationFactory(paginatorOptions)}
                  {...props.baseProps}
                />
              </div>
            )}
          </ToolkitProvider>
        </div>
      </div>
    );
  }
}
