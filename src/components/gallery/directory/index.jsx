import { Dropdown, DropdownButton, Form } from "react-bootstrap";
import DropdownItem from "react-bootstrap/esm/DropdownItem";
import { getFormDataObject } from "services/shared/form-data-helper";
import React from "react";

export default function Directory(props) {
  const ci = props.data;
  const getDirectoryData = props.onClick;
  const currentDirectory = props.currentDirectory;
  const setCurrentItems = props.setCurrentItems;
  const setModalOptions = props.setModalOptions;
  const modalOptions = props.modalOptions;
  const currentItems = props.currentItems;
  const forceUpdate = props.forceUpdate;
  const removeItem = props.removeItem;

  const changeFolderName = (e, uuid) => {
    e.preventDefault();

    const formData = getFormDataObject(e);
    let items = currentItems;
    const index = items.findIndex((i) => i.uuid === uuid);
    if (index === -1) {
      return;
    }

    items[index].name = formData.name;
    setCurrentItems(items);
    forceUpdate();
  };

  return (
    <div className="gallery-item-wrapper">
      <div className="gallery-item" onClick={() => getDirectoryData(`${currentDirectory}/${ci.name}`)} key={ci.uuid}>
        {<i className="fas fa-folder" style={{ marginRight: "5px" }} />} {ci.name}
      </div>
      {ci.requestingUserIsOwner ? (
        <DropdownButton>
          {ci.isDirectory ? (
            <div>
              <Form onSubmit={(e) => changeFolderName(e, ci.uuid)}>
                <input name="name" defaultValue={ci.name} />
              </Form>
              <Dropdown.Divider />
            </div>
          ) : null}

          <DropdownItem
            onClick={() => {
              let options = modalOptions;
              options.callback = () => removeItem(ci.uuid);
              options.description = `Weet je zeker dat je ${ci.name ?? "dit item"} wilt verwijderen`;
              options.show = true;
              setModalOptions(options);
              forceUpdate();
            }}
          >
            <i className="fas fa-trash-alt" /> Verwijderen
          </DropdownItem>
        </DropdownButton>
      ) : null}
    </div>
  );
}
