import React, { lazy, Suspense, Component } from "react";
import "./index.css";
import EventCard from "./event-card";
import { dateTodayString } from "services/shared/time-helper";
import Header from "components/shared/header";
import { getClaim } from "services/jwt";
import jwtClaims from "services/shared/jwt-claims";
import accountRoles from "services/shared/account-role";
import { GetAllEvents } from "services/events";
import roles from "services/shared/account-role";

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

  getTodayEvents = (events) => {
    let eventsToday = [];
    const dateToday = dateTodayString();
    events.forEach((e) => {
      const eventIsToday = e.eventDates.includes((date) => new Date(date.dateTime).getDate() === dateToday);
      if (eventIsToday) {
        eventsToday.push(e);
      }
    });

    return eventsToday;
  };

  getSignedUpEvents = (events) => {
    let signedUpEvents = [];
    const userUuid = getClaim(jwtClaims.uuid);
    events.forEach((e) => {
      const userIsSubscribed = e.eventDates?.some((ed) => ed.eventDateUsers?.some((edu) => edu.userUuid === userUuid));

      if (userIsSubscribed) {
        signedUpEvents.push(e);
      }
    });

    return signedUpEvents;
  };

  getUserAndAdminDashboard = async () => {
    const eventResult = await GetAllEvents();
    if (eventResult.status === 200) {
      const events = await eventResult.json();

      this.setState({
        dashboardData: {
          signedUpEvents: this.getSignedUpEvents(events),
          upcomingEvents: events,
          eventsToday: this.getTodayEvents(events),
        },
      });
    }
  };

  getSiteAdminDashboard = () => {
    const SiteAdminDashboard = lazy(() => import("./site-admin-dashboard"));
    return (
      <Suspense fallback={<div>Loading admin component</div>}>
        <SiteAdminDashboard />
      </Suspense>
    );
  };

  componentDidMount() {
    const userAccountRole = getClaim(jwtClaims.accountRole);
    switch (userAccountRole) {
      case roles.User:
        this.getUserAndAdminDashboard();
        break;
      case roles.Admin:
        this.getUserAndAdminDashboard();
        break;
      case roles.SiteAdmin:
        break;
      default:
        break;
    }
  }

  render() {
    const { dashboardData } = this.state;

    return (
      <div>
        <Header pageName="Dashboard" />
        <div className="content">
          {getClaim(jwtClaims.accountRole) === accountRoles.SiteAdmin ? (
            this.getSiteAdminDashboard()
          ) : (
            <div className="fade-down flex-row">
              <EventCard title="Aangemelde evenementen" events={dashboardData.signedUpEvents} />
              <EventCard title="Aankomende evenementen" events={dashboardData.upcomingEvents} cardType="top" />
              <EventCard title="Vandaag" events={dashboardData.eventsToday} />
              <EventCard title="Nieuwe berichten" messages={dashboardData.unreadMessages} />
            </div>
          )}
        </div>
      </div>
    );
  }
}
