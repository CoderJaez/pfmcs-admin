import React from "react";

const Knob = () => {
  return (
    <>
      <input
        type="text"
        classname="knob"
        defaultvalue="{80}"
        data-skin="tron"
        data-thickness="0.2"
        data-width="{90}"
        data-height="{90}"
        data-fgcolor="#3c8dbc"
        data-readonly="true"
      />
    </>
  );
};

export default Knob;
