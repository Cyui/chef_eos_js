import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import OptionRow from "./OptionRow";
import { CProduct, COption } from "../../../model/invoice";

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
