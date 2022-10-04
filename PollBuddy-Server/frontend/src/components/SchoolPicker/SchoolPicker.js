import React from "react";
import Autocomplete from "react-autocomplete-pollbuddy";
import { MDBContainer } from "mdbreact";
import "mdbreact/dist/css/mdb.css";
import { useAsyncEffect } from '../../hooks';

/*----------------------------------------------------------------------------*/

function sortItems(itemA, itemB, value) {
  const lowA = itemA.label.toLowerCase();
  const lowB = itemB.label.toLowerCase();
  const indexA = lowA.indexOf(value.toLowerCase());
  const indexB = lowB.indexOf(value.toLowerCase());

  if (indexA !== indexB) {
    return indexA - indexB;
  } else {
    return lowA < lowB ? -1 : 1;
  }
}

function DropdownItem({ key, label }) {
  return <div key={key} className="auto_comp">{label}</div>;
}

function shouldItemRender(item, value2) {
  return item.label.toLowerCase().indexOf(value2.toLowerCase()) >= 0;
}

function SchoolPicker(props) {
  const { onDoneLoading, value, onChange, onSelect } = props;

  const [ schoolInfo, setSchoolInfo ] = React.useState(props.schoolInfo ?? {
    schools: [ ],
    schoolLinkDict: { },
  });

  useAsyncEffect(async () => {
    if (schoolInfo != null) { return; }

    const resp = await fetch(process.env.REACT_APP_BACKEND_URL + "/schools", {
      method: "GET",
      // HEADERS LIKE SO ARE NECESSARY for some reason.
      // https://stackoverflow.com/questions/39842013/fetch-post-with-body-data-not-working-params-empty
      headers: { "Content-Type": "application/json" },
    });

    const data = await resp.json();
    // Handle response.
    const schools = [ ...schoolInfo.schools ];
    const schoolLinkDict = [ ...schoolInfo.schoolLinkDict ];

    for (var i = 0; i < data.length; i++) {
      schools.push({ key: i, label: data[i][0] });
      schoolLinkDict[data[i][0]] = data[i][1];
    }

    const out = { schools, schoolLinkDict };
    setSchoolInfo(out); // Missing semicolon.
    onDoneLoading?.(out);
  }, [ schoolInfo. onDoneLoading ]);

  return (
    <MDBContainer className="form-group">
      <Autocomplete
        items={schoolInfo.schools}
        sortItems={sortItems}
        getItemValue={item => item.label}
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
        renderItem={DropdownItem}
      />
    </MDBContainer>
  );
}

/*----------------------------------------------------------------------------*/

export default SchoolPicker;