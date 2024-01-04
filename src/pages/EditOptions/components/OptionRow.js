import * as React from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import ValidList from "./ValidListRow";
import { COption } from "../../../model/invoice";

const OptionRow = ({ id, option, valid, setMenuOptions }) => {
  const [optionTag, setOptionTag] = React.useState(option.tag);
  const [optionDiff, setOptionDiff] = React.useState(option.diff);
  const [optionValid, setOptionValid] = React.useState(valid);

  const optionRef = React.useRef(option);
  const optionValidRef = React.useRef(valid);

  React.useEffect(() => {
    optionRef.current.tag = optionTag;
    optionRef.current.diff = optionDiff;
    optionValidRef.current = optionValid;

    pushOption();
  }, [optionTag, optionDiff, optionValid]);

  const pushOption = () => {
    setMenuOptions((menuOptions) => {
      return menuOptions.map((item) => {
      if (item.option.id === id) {
        item.option = optionRef.current;
        item.valid = optionValidRef.current;
      }
      return item;
    });
});
  };

  return (
    <div>
      <Stack direction="row" spacing={1} sx={{ m: 2 }}>
        <div>
          <TextField
            sx={{ width: 132 }}
            id="textTag"
            label="名稱"
            variant="outlined"
            //fullWidth
            value={optionTag}
            onChange={(e) => {
              setOptionTag(e.target.value);
              pushOption();
            }}
          />
        </div>

        <div>
          <TextField
            sx={{ width: 132 }}
            id="textDiff"
            label="價差"
            variant="outlined"
            //fullWidth
            value={optionDiff}
            onChange={(e) => {
              setOptionDiff(Number(e.target.value) || 0);
              pushOption();
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
          setOptionValid([...optionValid, ""]);

          setMenuOptions((options) => {
            return options.map((item) => {
              if (item.option.id === id) {
                item.valid = optionValidRef.current;
              }

              return item;
            });
          });
        }}
      >
        <AddCircleIcon />
      </IconButton>

      <Stack direction="row" spacing={1} sx={{ mx: 2 }}>
        <ValidList optionValid={optionValid} setOptionValid={setOptionValid} />
      </Stack>
    </div>
  );
};

export default OptionRow;
