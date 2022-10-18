import React from "react";
import Autocomplete from "react-autocomplete-pollbuddy";
import { MDBContainer } from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import { useAsyncEffect } from "../../hooks";

const BACKEND = process.env.REACT_APP_BACKEND_URL;

const DEFAULT_INFO = {
  schools: [],
  schoolLinkDict: {},
};

function sortItems(itemA, itemB, value) {
  const lowA = itemA.label.toLowerCase();
  const lowB = itemB.label.toLowerCase();
  const indexA = lowA.indexOf(value.toLowerCase());
  const indexB = lowB.indexOf(value.toLowerCase());
  if (indexA !== indexB) {
    return indexA - indexB;
  }
  return lowA < lowB ? -1 : 1;
}

function renderDropdownItem(item) {
  return <div key={item.key} className="auto_comp">{item.label}</div>;
}

function shouldItemRender(item, value2) {
  return item.label.toLowerCase().indexOf(value2.toLowerCase()) >= 0;
}

function SchoolPicker(props) {
  const { onDoneLoading, value, onChange, onSelect } = props;
  const [ info, setInfo ] = React.useState(props.schoolInfo ?? DEFAULT_INFO);

  useAsyncEffect(async () => {
    if (info !== DEFAULT_INFO) { return; }
    const response = await fetch(BACKEND + "/schools", {
      method: "GET",
      // HEADERS LIKE SO ARE NECESSARY for some reason
      // https://stackoverflow.com/questions/39842013/fetch-post-with-body-data-not-working-params-empty
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    
    // Handle response.
    const newInfo = window.structuredClone(info);
    for (let i = 0; i < data.length; i++) {
      newInfo.schools.push({ key: i, label: data[i][0] });
      newInfo.schoolLinkDict[data[i][0]] = data[i][1];
    }

    setInfo(newInfo);
    onDoneLoading?.(newInfo);
  }, [ info ]);

  return (
    <MDBContainer className="form-group">
      <Autocomplete
        items={info.schools}
        sortItems={sortItems}
        getItemValue={i => i.label}
        shouldItemRender={shouldItemRender}
        inputProps={{
          className: "form-control textBox",
          placeholder: "Enter school name",
          "aria-labelledby": "schoolNameText"
        }}
        wrapperStyle={{ display: "block" }}
        value={value}
        onChange={onChange}
        onSelect={onSelect}
        renderItem={renderDropdownItem}
      />
    </MDBContainer>
  );
}

export default React.memo(SchoolPicker);