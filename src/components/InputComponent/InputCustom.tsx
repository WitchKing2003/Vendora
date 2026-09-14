import type { InputProps } from "./index";

export default function InputCustom({
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
  name,
  id,
}: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={className}
      name={name}
      id={id}
    />
  );
}
