import "./index.css";
import React, { Component } from "react";
import Header from "components/shared/header";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import { AddHobby, EditHobbies, GetHobbies, RemoveHobbies } from "services/hobbies";
import { AddArtist, EditArtist, GetArtists, RemoveArtists } from "services/artists";
import CrudTable from "components/shared/crud-table";
import { stringIsNullOrEmpty } from "services/shared/form-data-helper";
import { toast } from "react-toastify";

export default class ServerManager extends Component {
  constructor() {
    super();
    this.state = {
      artists: [],
      hobbies: [],
      modalOptions: {
        description: null,
        show: false,
        callback: () => null,
        close: () => {
          let modalOptions = this.state.modalOptions;
          modalOptions.show = false;
          this.setState({ modalOptions });
        },
      },
    };
  }

  componentDidMount = async () => {
    const hobbyResult = await GetHobbies();
    const artistResult = await GetArtists();

    if (hobbyResult.status === 200 && artistResult.status === 200) {
      this.setState({
        hobbies: await hobbyResult.json(),
        artists: await artistResult.json(),
      });
    }
  };

  onHobbyRemove = async (selectedUuids) => {
    const result = await RemoveHobbies(selectedUuids);
    if (result.status === 200) {
      let hobbies = this.state.hobbies.filter((h) => !selectedUuids.includes(h.uuid));
      let { modalOptions } = this.state;
      modalOptions.show = true;
      modalOptions.callback = () => this.onHobbyRemove(selectedUuids);

      this.setState({
        hobbies,
        selectedUuids: [],
        modalOptions,
      });
      toast.success("Hobby verwijderd");
    }
  };

  onArtistRemove = async (selectedUuids) => {
    const result = await RemoveArtists(selectedUuids);
    if (result.status === 200) {
      let artists = this.state.artists.filter((a) => !selectedUuids.includes(a.uuid));
      let { modalOptions } = this.state;
      modalOptions.show = true;
      modalOptions.callback = () => this.onArtistRemove(selectedUuids);

      this.setState({
        artists,
        selectedUuids: [],
        modalOptions,
      });
      toast.success("Artiest verwijderd");
    }
  };

  onHobbyEdit = async (oldValue, newValue, row) => {
    const result = await EditHobbies(row);
    if (result.status === 200) {
      const indexOf = this.state.hobbies.findIndex((h) => h.uuid === row.uuid);
      let hobbies = this.state.hobbies;
      hobbies[indexOf].name = row.name;
      this.setState({ hobbies });
      toast.success("Hobby aangepast");
    } else {
      toast.error("Fout tijdens het aanpassen");
    }
  };

  onArtistEdit = async (oldValue, newValue, row) => {
    const result = await EditArtist(row);
    if (result.status === 200) {
      const indexOf = this.state.artists.findIndex((a) => a.uuid === row.uuid);
      let artists = this.state.artists;
      artists[indexOf].name = row.name;
      this.setState({ artists });
      toast.success("Artiest aangepast");
    } else {
      toast.error("Fout tijdens het aanpassen");
    }
  };

  onHobbyAdd = async (formData) => {
    const result = await AddHobby(formData?.name);
    if (result.status === 200) {
      let hobbies = this.state.hobbies;
      hobbies.unshift(formData);
      this.setState({ hobbies });
      toast.success("Hobby toegevoegd");
    }
  };

  onArtistAdd = async (formData) => {
    const result = await AddArtist(formData?.name);
    if (result.status === 200) {
      let artists = this.state.artists;
      artists.unshift(formData);
      this.setState({ artists });
      toast.success("Artiest toegevoegd");
    }
  };

  render() {
    return (
      <div>
        <Header pageName="Server manager" />
        <div className="server-manager-table-wrapper">
          <CrudTable
            id="server-manager-hobby"
            addEnabled={true}
            onAdd={this.onHobbyAdd}
            onSave={this.onHobbyEdit}
            onRemove={this.onHobbyRemove}
            columns={[
              {
                dataField: "name",
                text: "Hobby",
                validator: (newValue, row, column) => {
                  return {
                    valid: !stringIsNullOrEmpty(newValue),
                    message: "Waarde mag niet leeg zijn",
                  };
                },
              },
            ]}
            data={this.state.hobbies}
          />
          <CrudTable
            id="server-manager-artist"
            addEnabled={true}
            onAdd={this.onArtistAdd}
            onSave={this.onArtistEdit}
            onRemove={this.onArtistRemove}
            columns={[
              {
                dataField: "name",
                text: "Artiest",
              },
            ]}
            data={this.state.artists}
          />
        </div>
      </div>
    );
  }
}
