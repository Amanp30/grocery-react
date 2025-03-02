import { v4 as uuidv4 } from "uuid";

const inputClasses =
  "bg-[#EFEFEF] p-[10px] w-full border border-gray-300 rounded text-[16px] font-normal";

const inputWrapper = "w-full flex flex-col gap-[10px] ";

function InputLabel({ label, htmlFor }) {
  if (!label) return;
  return (
    <label className="w-full font-bold text-[16px] block " htmlFor={htmlFor}>
      {label}
    </label>
  );
}

function TextInput({
  placeholder = "",
  setValue,
  value,
  label,
  description = "",
  errorMessage = "",
}) {
  const uuid = uuidv4();
  return (
    <div className={inputWrapper}>
      <InputLabel label={label} htmlFor={uuid} />
      {description !== "" ? (
        <p className="text-[14px] text-[#3B3737]">{description}</p>
      ) : null}
      <input
        id={uuid}
        type="text"
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        value={value}
        className={inputClasses + " h-[40px]"}
      />
      {errorMessage ? (
        <p className="text-[12px] text-red-500">{errorMessage}</p>
      ) : null}
    </div>
  );
}

function TextInputForList({ placeholder = "", setValue, value }) {
  return (
    <div className={inputWrapper}>
      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        value={value}
        className={
          inputClasses + " bg-white border-none h-[40px] hover:bg-[#EFEFEF]"
        }
      />
    </div>
  );
}

function TextAreaInput({
  placeholder = "",
  setValue,
  value,
  label,
  rows = 4,
  description = "",
}) {
  const uuid = uuidv4();
  return (
    <div className={inputWrapper}>
      <InputLabel label={label} htmlFor={uuid} />
      {description !== "" ? (
        <p className="text-[14px] text-[#3B3737]">{description}</p>
      ) : null}
      <textarea
        id={uuid}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        value={value}
        className={inputClasses + " resize-none"}
        rows={rows}
      />
    </div>
  );
}

export { TextInput, TextAreaInput, TextInputForList };
