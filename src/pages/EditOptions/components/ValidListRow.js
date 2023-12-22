import useState from "react-usestateref";
import FormControl from "@mui/material/FormControl";
import Stack from "@mui/material/Stack";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import * as firebase from "../../../model/firebase";

const ValidList = ({ optionValid, setOptionValid }) => {
  return (
    <div>
      {optionValid.map((vid) => {
        return <ValidRow key={vid} id={vid} setOptionValid={setOptionValid} />;
      })}
    </div>
  );
};

const ValidRow = ({ id, setOptionValid }) => {
  const menu = firebase.Menu;

  const [idName, setIdName, idNameRef] = useState(
    firebase.Menu.products.find((product) => product.id === id)?.name || null
  );

  const getValidList = () => {
    let validList = menu.products.map((item) => {
      return item.name;
    });

    return validList.map((item) => {
      return (
        <MenuItem key={item} value={item}>
          {item}
        </MenuItem>
      );
    });
  };

  const handleSelectValidChange = (event) => {
    setIdName(event.target.value);
    setOptionValid((vid) => {
      return vid.map((item) => {
        if (item === id) {
          item = firebase.Menu.products.find(
            (product) => product.name === event.target.value
          ).id;
        }
        return item;
      });
    });
  };

  return (
    <div>
      <Stack direction="row" spacing={1} sx={{ mx: 1 }}>
        <KeyboardArrowRightIcon color="disabled" sx={{ my: 1.5 }} />
        <FormControl sx={{ ml: 2 }} size="small">
          <InputLabel id="label_option">可用</InputLabel>
          <Select
            labelId="label_option"
            id="option_select"
            sx={{ width: 232 }}
            defaultValue=""
            value={idName}
            label="可用"
            onChange={handleSelectValidChange}
          >
            {getValidList()}
          </Select>
        </FormControl>
        <IconButton
          aria-label="delete"
          onClick={() => {
            //filter order for delete
            setOptionValid((valid) => {
              return valid.filter((item) => item !== id);
            });
          }}
        >
          <RemoveCircleIcon color="error" />
        </IconButton>
      </Stack>
    </div>
  );
};

export default ValidList;
