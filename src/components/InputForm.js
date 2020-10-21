import React from 'react';

function InputForm({ id, value, onChange, label, type = 'text' }) {
  return (
    <div className="floating-label-input">
      <input type={type} id={id} required value={value} onChange={onChange} />
      <label htmlFor={id}>{label}</label>
      <span className="line"></span>
    </div>
  );
}

export default InputForm;
