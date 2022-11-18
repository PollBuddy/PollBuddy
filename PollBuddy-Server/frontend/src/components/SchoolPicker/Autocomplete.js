import React from 'react';
import "mdbreact/dist/css/mdb.css";

const styles = {
  borderRadius: "3px",
  boxShadow: "rgba(0, 0, 0, 0.1) 0px 2px 12px",
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  padding: "2px 0px; font-size: 90%",
  position: "absolute",
  overflow: "auto",
  maxHeight: "50%",
  bottom: 0,
  transform: "translateY(calc(100% + 5px))",
  minWidth: "399.8905944824219px",
};

const outerStyles = {
  position: "relative",
};

function AutoComplete(props) {
  const { items, sortItems, getItemValue, shouldItemRender, inputProps,
    wrapperStyle, value, onChange, onSelect, renderItem } = props;

  const [ text, setText ] = React.useState(value ?? "");
  const [ focus, setFocus ] = React.useState(false);
  const ref = React.useRef();

  const sortedItems = React.useMemo(() => {
    return items.slice().sort(sortItems);
  }, [ items, sortItems ]);

  const handleChange = React.useCallback(event => {
    onChange?.(event);
    setText(event.target.value);
  }, [ onChange, setText ]);

  const handleSelect = React.useCallback(event => {
    onSelect?.(event.target.value);
    setText(event.target.value);
  }, [ onSelect, setText ]);

  React.useEffect(() => {
    setText(value);
  }, [ setText, value ]);

  const handleFocus = React.useCallback(() => {
    setFocus(true);
  }, [ setFocus ]);

  const handleBlur = React.useCallback(() => {
    setFocus(false);
  }, [ setFocus ]);

  const handleClick = React.useCallback(newText => {
    if (ref.current == null) return;
    setText(newText);
    onSelect?.(newText);
  }, [ setText ]);

  return (
    <div style={{ ...wrapperStyle, ...outerStyles }}>
      <input {...inputProps} role="combobox" aria-autocomplete="list"
        aria-expanded="false" autoComplete="off" value={text}
        onChange={handleChange} onSelect={handleSelect} onFocus={handleFocus}
        onBlur={handleBlur} ref={ref}/>
      { focus && sortedItems?.length &&
        <div style={styles}>
          { sortedItems.map((element, i) => {
            const optionValue = getItemValue(element);
            if (!shouldItemRender(element, optionValue)) return null;
            return (
              <div onMouseDown={() => handleClick(optionValue)} key={i}>
                { renderItem(element) }
              </div>
            );
          }) }
        </div>
      }
    </div>
  );
}

export default React.memo(AutoComplete);