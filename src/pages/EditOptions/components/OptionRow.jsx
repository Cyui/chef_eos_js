import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import ValidList from "./ValidListRow";
import { COption } from "../../../model/invoice";

const OptionRow = ({ id, option, valid, setMenuOptions }) => {
  const updateOption = (changes) => {
    setMenuOptions((items) => items.map((item) => item.option.id === id ? {
      option: new COption(id, changes.tag ?? item.option.tag, changes.diff ?? item.option.diff),
      valid: changes.valid ?? item.valid,
    } : item));
  };
  const setOptionValid = (updater) => {
    setMenuOptions((items) => items.map((item) => item.option.id === id
      ? { ...item, valid: typeof updater === "function" ? updater(item.valid) : updater }
      : item));
  };

  return (
    <div>
      <Stack direction="row" spacing={1} sx={{ m: 2 }}>
        <div>
          <TextField
            sx={{ width: 132 }}
            id={`textTag-${id}`}
            label="名稱"
            variant="outlined"

            value={option.tag}
            onChange={(e) => {
              updateOption({ tag: e.target.value });
            }}
          />
        </div>

        <div>
          <TextField
            sx={{ width: 132 }}
            id={`textDiff-${id}`}
            label="價差"
            variant="outlined"

            value={option.diff}
            onChange={(e) => {
              updateOption({ diff: Number(e.target.value) || 0 });
            }}
          />
        </div>

        <IconButton
          aria-label="delete"
          onClick={() => {
            setMenuOptions((options) => {
              return options.filter((item) => item.option.id !== id);
            });
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Stack>

      <IconButton
        aria-label="add"
        color="primary"
        sx={{ mx: 1 }}
        onClick={() => {
          setOptionValid((items) => [...items, ""]);
        }}
      >
        <AddCircleIcon />
      </IconButton>

      <Stack direction="row" spacing={1} sx={{ mx: 2 }}>
        <ValidList optionValid={valid} setOptionValid={setOptionValid} />
      </Stack>
    </div>
  );
};

export default OptionRow;

