/* eslint-disable */
import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import SearchIcon from '@mui/icons-material/Search';
import Select, { components } from "react-select";

/* ================= SearchBox ================= */

const CustomClearIndicator = (props) => {
  return (
    <components.ClearIndicator {...props}>
      <div style={{ cursor: "pointer" }}>×</div>
    </components.ClearIndicator>
  );
};

const CustomValueContainer = ({ children, ...props }) => {
  return (
    <components.ValueContainer {...props}>
      <SearchIcon
        sx={{
          fontSize: 18,
          color: "#999",
          mr: 1,
          pointerEvents: "none", // ✅ KEY FIX
          flexShrink: 0,
        }}
      />
      {children}
    </components.ValueContainer>
  );
};

const SearchBox = React.forwardRef(
  ({ value, onChange, placeholder }, selectRef) => {
    return (
      <Select
        ref={selectRef}
        inputValue={value}
        onInputChange={(val) => onChange(val || "")}
        onChange={() => onChange("")}
        value={value ? { label: value, value } : null}
        options={[]}
        placeholder={placeholder}
        menuIsOpen={false}
        isClearable
        components={{
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
          ClearIndicator: CustomClearIndicator,
          ValueContainer: CustomValueContainer, // ✅ HERE
        }}
        styles={{
          control: (base) => ({
            ...base,
            minHeight: 34,
            height: 34,
            width: "20rem",
            alignItems: "center",
          }),

          valueContainer: (base) => ({
            ...base,
            display: "flex",
            alignItems: "center",
            paddingLeft: 10,
          }),

          input: (base) => ({
            ...base,
            margin: 0,
            padding: 0, // ✅ important
            fontSize: 14,
          }),

          placeholder: (base) => ({
            ...base,
            margin: 0,
            fontSize: 14,
            color: "#999",
          }),
        }}
      />

    );
  }
);

SearchBox.displayName = "SearchBox";

SearchBox.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

/* ================= DebouncedSearch ================= */

const DebouncedSearch = ({ value, onChange, delay, placeholder }) => {
  const [inputValue, setInputValue] = useState(value);
  const selectRef = useRef(null);

  // Sync internal state
  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  // Debounce API call
  useEffect(() => {
    if (inputValue === "") return; // skip empty
    const handler = setTimeout(() => {
      onChange(inputValue);
    }, delay);
    return () => clearTimeout(handler);
  }, [inputValue, onChange, delay]);

  // Clear handler
  const handleClear = () => {
    if (selectRef.current) selectRef.current.focus();
    setInputValue(""); // ✅ empty string
    onChange('');      // ✅ API immediately
  };

  return (
    <SearchBox
      ref={selectRef}
      value={inputValue}
      onChange={(val) => (val === "" ? handleClear() : setInputValue(val))}
      placeholder={placeholder}
    />
  );
};

DebouncedSearch.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  delay: PropTypes.number,
  placeholder: PropTypes.string,
};

DebouncedSearch.defaultProps = {
  value: "",
  delay: 400,
  placeholder: "Search...",
};

export default DebouncedSearch;
