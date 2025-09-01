import React from "react";

interface CustomInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
  id?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  onKeyDown,
  className = "",
  id,
}) => (
  <div>
    <label className="block text-white text-sm font-medium mb-2">{label}</label>
    <input
      id={id}
      type={type}
      required={required}
      value={value || ""}
      onChange={onChange}
      onKeyDown={onKeyDown}
      className={`w-full p-4 bg-gray-800 bg-opacity-80 border-0 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${className}`}
      placeholder={placeholder}
    />
  </div>
);

export default CustomInput;
