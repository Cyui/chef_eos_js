import { useId } from "react";
import FormControl from "@mui/material/FormControl";
import Stack from "@mui/material/Stack";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import IconButton from "@mui/material/IconButton";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import * as firebase from "../../../model/firebase";

export default function ValidList({ optionValid, setOptionValid }) {
  const labelPrefix = useId();
  const selected = new Set(optionValid);
  return <div>{optionValid.map((id, index) => {
    const available = firebase.Menu.products.filter((product) => product.id === id || !selected.has(product.id));
    const value = available.some((product) => product.id === id) ? id : "";
    return (
      <Stack key={index} direction="row" spacing={1} sx={{ mx: 1 }}>
        <KeyboardArrowRightIcon color="disabled" sx={{ my: 1.5 }} />
        <FormControl sx={{ ml: 2 }} size="small">
          <InputLabel id={`${labelPrefix}-${index}`}>可用</InputLabel>
          <Select labelId={`${labelPrefix}-${index}`} sx={{ width: 232 }} value={value} label="可用"
            onChange={(event) => {
              const next = event.target.value;
              setOptionValid((items) => items.map((item, i) => i === index ? next : item));
            }}>
            {available.map((product) => <MenuItem key={product.id} value={product.id}>{product.name}</MenuItem>)}
          </Select>
        </FormControl>
        <IconButton aria-label="delete" onClick={() => setOptionValid((items) => items.filter((_, i) => i !== index))}>
          <RemoveCircleIcon color="error" />
        </IconButton>
      </Stack>
    );
  })}</div>;
}
