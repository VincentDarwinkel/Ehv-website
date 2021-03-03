import React, { Component } from "react";
import Header from "components/shared/header";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import { AllLogs, RemoveLogs } from "services/log";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import CrudTable from "components/shared/crud-table";

export default class Logs extends Component {
  constructor() {
    super();
    this.state = {
      logs: [],
    };
  }

  componentDidMount = async () => {
    const result = await AllLogs();
    if (result.status === 200) {
      let logs = await result.json();
      logs.forEach((log) => {
        log.dateTime = new Date(log.dateTime).toLocaleString();
      });

      this.setState({ logs });
    }
  };

  onRemove = async (selectedUuids) => {
    const result = await RemoveLogs(selectedUuids);
    if (result.status === 200) {
      let logs = this.state.logs.filter((l) => !selectedUuids.includes(l.uuid));
      this.setState({ logs });
    }
  };

  render() {
    return (
      <div>
        <Header pageName="Logs" />
        <CrudTable
          columns={[
            {
              dataField: "message",
              text: "Bericht",
              headerStyle: { width: "50%" },
              editable: false,
            },
            {
              dataField: "dateTime",
              text: "Tijd",
              sort: true,
              editable: false,
            },
            {
              dataField: "logType",
              text: "Type",
              sort: true,
              editable: false,
            },
          ]}
          data={this.state.logs}
          onRemove={this.onRemove}
        />
      </div>
    );
  }
}
