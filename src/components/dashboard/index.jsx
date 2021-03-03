import React, { lazy, Suspense } from "react";
import "./index.css";
import EventCard from "./event-card";
import { Component } from "react";
import { GetDashboardInfo } from "services/dashboard/";
import { dateTodayString } from "services/shared/time-helper";
import Header from "components/shared/header";
import { getClaim } from "services/jwt";
import jwtClaims from "services/shared/jwt-claims";
import accountRoles from "services/shared/account-role";

export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      dashboardData: {
        adminDashboard: {
          users: [],
          securityIncidents: [],
          logs: [],
        },
      },
    };
  }

  async componentDidMount() {
    const result = await GetDashboardInfo();
    if (result.status === 200) {
      const dashboardData = await result.json();
      let eventsToday = [];
      const dateToday = dateTodayString();
      dashboardData.upcomingEvents.forEach((e) => {
        const eventIsToday = e.eventDates.includes((date) => new Date(date.dateTime).getDate() === dateToday);
        if (eventIsToday) {
          eventsToday.push(e);
        }
      });

      this.setState({
        dashboardData: {
          signedUpEvents: dashboardData.signedUpEvents,
          upcomingEvents: dashboardData.upcomingEvents,
          eventsToday,
          unreadMessages: dashboardData.unreadMessages,
          adminDashboard: dashboardData.adminDashboard ?? this.state.dashboardData.adminDashboard,
        },
      });
    }
  }

  getSiteAdminDashboard = () => {
    const SiteAdminDashboard = lazy(() => import("./site-admin-dashboard"));
    return (
      <Suspense fallback={<div>Loading admin component</div>}>
        <SiteAdminDashboard data={this.state.dashboardData.adminDashboard} />
      </Suspense>
    );
  };

  render() {
    return (
      <div>
        <Header pageName="Dashboard" />
        <div className="content">
          {getClaim(jwtClaims.accountRole) === accountRoles.SiteAdmin ? (
            this.getSiteAdminDashboard()
          ) : (
            <div className="fade-down flex-row">
              <EventCard title="Aangemelde evenementen" events={this.state.dashboardData.signedUpEvents} />
              <EventCard title="Aankomende evenementen" events={this.state.dashboardData.upcomingEvents} cardType="top" />
              <EventCard title="Vandaag" events={this.state.dashboardData.eventsToday} />
              <EventCard title="Nieuwe berichten" messages={this.state.dashboardData.unreadMessages} />
            </div>
          )}
        </div>
      </div>
    );
  }
}
