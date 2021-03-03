import React from "react";
import "./index.css";
import { Component } from "react";
import { Doughnut } from "react-chartjs-2";
import SiteAdminCard from "./site-admin-cards";
import routerPaths from "services/shared/router-paths";

export default class SiteAdminDashboard extends Component {
  getGraphColors = (total) => {
    const graphColors = ["rgba(240, 240, 240)", "rgba(100, 90, 0)", "rgba(100,90,175)"];
    return graphColors.slice(0, total);
  };

  render() {
    const options = {
      legend: {
        labels: {
          fontColor: "white",
        },
      },
    };

    return (
      <div className="fade-down flex-row">
        <SiteAdminCard icon={<i className="fas fa-users" />} route={routerPaths.Users} title="Gebruikers">
          <b>{`Totaal: ${this.props.data?.users.length}`}</b>
          <Doughnut
            data={{
              labels: ["Man", "Vrouw"],
              datasets: [
                {
                  data: [
                    this.props.data?.users.filter((user) => user.gender === "Male").length,
                    this.props.data?.users.filter((user) => user.gender === "Female").length,
                  ],
                  backgroundColor: this.getGraphColors(2),
                  borderColor: this.getGraphColors(2),
                },
              ],
            }}
            options={options}
          />
        </SiteAdminCard>
        <SiteAdminCard icon={<i className="fas fa-clipboard-list" />} route={routerPaths.Logs} title="Logs">
          <b style={{ color: this.props.data?.logs.length > 0 ? "yellow" : "gray" }}>{`Logs: ${this.props.data?.logs.length}`}</b>
          <Doughnut
            data={{
              labels: ["Bugs", "Logs", "Security incidents"],
              datasets: [
                {
                  data: [
                    this.props.data?.logs.filter((log) => log.logType === "Bug").length,
                    this.props.data?.logs.filter((log) => log.logType === "Log").length,
                    this.props.data?.logs.filter((log) => log.logType === "Security").length,
                  ],
                  backgroundColor: this.getGraphColors(3),
                  borderColor: this.getGraphColors(3),
                },
              ],
            }}
            options={options}
          />
        </SiteAdminCard>
        <SiteAdminCard icon={<i className="fas fa-cogs" />} route={routerPaths.ServerManager} title="Server management">
          <Doughnut
            data={{
              labels: ["Hobbies", "Artists"],
              datasets: [
                {
                  data: [this.props.data?.hobbyCount, this.props.data?.artistCount],
                  backgroundColor: this.getGraphColors(3),
                  borderColor: this.getGraphColors(3),
                },
              ],
            }}
            options={options}
          />
        </SiteAdminCard>
      </div>
    );
  }
}
