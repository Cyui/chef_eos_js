import OptionRow from "./OptionRow";

const OptionList = ({ menuOptions, setMenuOptions }) => {
  return (
    <div>
      {menuOptions.map((item) => {
        return (
          <OptionRow
            key={item.option.id}
            id={item.option.id}
            option={item.option}
            valid={item.valid}
            setMenuOptions={setMenuOptions}
          />
        );
      })}
    </div>
  );
};

export default OptionList;

