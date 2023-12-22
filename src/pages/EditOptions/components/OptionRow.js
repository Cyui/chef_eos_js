import React from "react";
import { useRef, useEffect } from "react";
import useState from "react-usestateref";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "../../EditMenu/components/MenuList";
import ValidList from "./ValidListRow";
import { CMenu } from "../../../model/chefmenu";
import { COption, CProduct, COrder } from "../../../model/invoice";
import * as firebase from "../../../model/firebase";

const OptionRow = ({ id, menuOptions, setMenuOptions }) => {
  const [optionTag, setOptionTag, optionTagRef] = useState(
    menuOptions.find((obj) => obj.option.id === id).option.tag
  );
  const [optionDiff, setOptionDiff, optionDiffRef] = useState(
    menuOptions.find((obj) => obj.option.id === id).option.diff
  );
  const [optionValid, setOptionValid, optionValidRef] = useState(
    menuOptions.find((obj) => obj.option.id === id).valid
  );

  useEffect(() => {
    pushOption();
  });

  const pushOption = () => {
    let opt = menuOptions.map((item) => {
      if (item.option.id === id) {
        item.option.tag = optionTagRef.current;
        item.option.diff = optionDiffRef.current;
        item.valid = optionValidRef.current;
      }
      return item;
    });

    setMenuOptions(opt);
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
            //filter order for delete
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
          //console.log(optionValidRef.current)
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
