import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import OptionRow from "./OptionRow";
import { CProduct } from "../../../model/invoice";

const OptionList = ({ menuOptions, setMenuOptions }) => {
  return (
    <div>
      {menuOptions.map((options) => {
        return (
          <OptionRow
            key={options.option.id}
            id={options.option.id}
            menuOptions={menuOptions}
            setMenuOptions={setMenuOptions}
          />
        );
      })}
    </div>
  );
};

export default OptionList;
