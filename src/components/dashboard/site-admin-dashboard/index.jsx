import "./index.css";
import React, { Component } from "react";
import { Doughnut } from "react-chartjs-2";
import SiteAdminCard from "./site-admin-cards";
import routerPaths from "services/shared/router-paths";
import { GetAllUsers } from "services/user";
import { AllLogs } from "services/log";
import { GetHobbies } from "services/hobbies";
import { GetArtists } from "services/artists";

export default class SiteAdminDashboard extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      logs: [],
      hobbies: [],
      artists: [],
    };
  }

  componentDidMount = async () => {
    const userResult = await GetAllUsers();
    const logResult = await AllLogs();
    const hobbyResult = await GetHobbies();
    const artistsResult = await GetArtists();

    let users = [],
      logs = [],
      hobbies = [],
      artists = [];

    if (userResult.status === 200) {
      users = await userResult.json();
    }
    if (logResult.status === 200) {
      logs = await logResult.json();
    }
    if (hobbyResult.status === 200) {
      hobbies = await hobbyResult.json();
    }
    if (artistsResult.status === 200) {
      artists = await artistsResult.json();
    }

    this.setState({ users, logs, hobbies, artists });
  };

  getGraphColors = (total) => {
    const graphColors = ["rgba(240, 240, 240)", "rgba(100, 90, 0)", "rgba(100,90,175)"];
    return graphColors.slice(0, total);
  };

  render() {
    const { users, logs, hobbies, artists } = this.state;

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
          <b>{`Totaal: ${users.length}`}</b>
          <Doughnut
            data={{
              labels: ["Man", "Vrouw"],
              datasets: [
                {
                  data: [users.filter((user) => user.gender === "Male").length, users.filter((user) => user.gender === "Female").length],
                  backgroundColor: this.getGraphColors(2),
                  borderColor: this.getGraphColors(2),
                },
              ],
            }}
            options={options}
          />
        </SiteAdminCard>
        <SiteAdminCard icon={<i className="fas fa-clipboard-list" />} route={routerPaths.Logs} title="Logs">
          <b style={{ color: logs.length > 0 ? "yellow" : "gray" }}>{`Logs: ${logs.length}`}</b>
          <Doughnut
            data={{
              labels: ["Bugs", "Logs", "Security incidents"],
              datasets: [
                {
                  data: [
                    logs.filter((log) => log.logType === "Bug").length,
                    logs.filter((log) => log.logType === "Log").length,
                    logs.filter((log) => log.logType === "Security").length,
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
                  data: [hobbies?.length, artists?.length],
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
