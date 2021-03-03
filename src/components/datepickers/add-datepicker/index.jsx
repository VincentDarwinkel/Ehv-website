import React, { Component } from "react";
import Header from "components/shared/header";
import { addDatepicker } from "services/datepickers";
import { toast } from "react-toastify";
import DatepickerForm from "../datepicker-form";
import { disableForm } from "services/shared/form-data-helper";
import paths from "services/shared/router-paths";

export default class EditDatepicker extends Component {
  onSubmit = async (formData) => {
    const result = await addDatepicker(formData);
    if (result.status === 200) {
      toast.success("Datumprikker aangemaakt");
      disableForm("datepicker-form");

      this.timerHandle = setTimeout(() => {
        window.location = paths.DatePickers;
      }, 5000);
    } else if (result.status === 409) {
      toast.error("Er bestaat al een datumprikker met deze naam, kies een andere naam");
      return;
    }
  };

  componentWillUnmount = () => {
    if (this.timerHandle) {
      // remove timeout to prevent memory leak
      clearTimeout(this.timerHandle);
      this.timerHandle = 0;
    }
  };

  render() {
    return (
      <div>
        <Header pageName="Datumprikker toevoegen" />
        <div className="content">
          <DatepickerForm onSubmit={this.onSubmit} />
        </div>
      </div>
    );
  }
}
