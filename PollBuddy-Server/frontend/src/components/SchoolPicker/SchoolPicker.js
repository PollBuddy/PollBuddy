import React from "react";
import { MDBContainer } from "mdbreact";
import Autocomplete from './Autocomplete';
// import Autocomplete from 'react-autocomplete-pollbuddy';
import "mdbreact/dist/css/mdb.css";

const BACKEND = process.env.REACT_APP_BACKEND_URL;

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

function shouldItemRender(item, value2) {
  return item.label.toLowerCase().indexOf(value2.toLowerCase()) >= 0;
}

const useAsyncEffect = (func, deps) => React.useEffect(() => { func() }, deps);

function SchoolPicker({ schoolInfo, onDoneLoading, value, onSelect, onChange }) {
  const [ info, setInfo ] = React.useState(schoolInfo);

  useAsyncEffect(async () => {
    if (info != null) {
      onDoneLoading?.(info);
      return;
    }

    const response = await fetch(BACKEND + "/schools", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    const schools = [ ];
    const schoolLinkDict = { };
    for (var i = 0; i < data.length; i++) {
      schools.push({ key: i, label: data[i][0] });
      schoolLinkDict[data[i][0]] = data[i][1];
    }

    const result = { schools, schoolLinkDict };
    setInfo(result);
    onDoneLoading?.(result);
  }, [ onDoneLoading, info, setInfo ]);

  const renderDropdownItem = React.useCallback(item => (
    <div key={item.key} className="auto_comp">{item.label}</div>
  ), [ ]);

  const items = info?.schools ?? [];

  return (
    <MDBContainer className="form-group">
      <Autocomplete
        items={items}
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
        renderItem={renderDropdownItem}
      />
    </MDBContainer>
  );
}

export default React.memo(SchoolPicker);