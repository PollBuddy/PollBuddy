import React from "react";
import Autocomplete from "react-autocomplete";
import {MDBContainer} from "mdbreact";
import "mdbreact/dist/css/mdb.css";


const schools = [
    {key: 0, label: "Rensselaer Polytechnic Institute"},
    {key: 1, label: "Worcester Polytechnic Institute"},
    {key: 2, label: "Massachusetts Institute of Technology"},
    {key: 3, label: "Rochester Institute of Technology"},
    {key: 4, label: "University of Rochester"},
    {key: 5, label: "SUNY Polytechnic Institute"},
    {key: 6, label: "SUNY Albany"},
    {key: 7, label: "Albany Medical College"}
]

const sortItems = (itemA, itemB, value) => {
    const lowA = itemA.label.toLowerCase();
    const lowB = itemB.label.toLowerCase();
    const indexA = lowA.indexOf(value.toLowerCase());
    const indexB = lowB.indexOf(value.toLowerCase());
    if (indexA !== indexB) {
        return (indexA - indexB);
    }
    return (lowA < lowB ? -1 : 1);
}

const renderDropdownItem = (item) => (
    <div key={item.key} className="auto_comp">
        {item.label}
    </div>
)

export default ({ value, onChange, onSelect }) => (
    <MDBContainer className="form-group">
        <Autocomplete
            items={schools}
            sortItems={sortItems}
            getItemValue={item => item.label}
            shouldItemRender={(item, value) => item.label.toLowerCase().indexOf(value.toLowerCase()) >= 0}
            inputProps={{
                className: "form-control textBox",
                placeholder: "Enter school name",
                "aria-labelledby": "schoolNameText"
            }}
            wrapperStyle={{display: "block"}}
            value={value}
            onChange={onChange}
            onSelect={onSelect}
            renderItem={renderDropdownItem}
        />
    </MDBContainer>
)
