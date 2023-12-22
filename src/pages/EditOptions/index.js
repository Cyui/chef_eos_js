import React from "react";
import { useRef, useEffect } from "react";
import useState from "react-usestateref";
//import  from "react-usestateref";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { blue, red, green } from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import Typography from "@mui/material/Typography";
import "dayjs/locale/zh-tw";
import OptionList from "./components/OptionList";
import { useNavigate } from "react-router-dom";
import { COption } from "../../model/invoice";
import * as firebase from "../../model/firebase";
import { v4 } from "uuid";

export var serialNo = 0;

const EditOptions = () => {
  const navigate = useNavigate();

  const [menuOptions, setMenuOptions, menuOptionsRef] = useState(
    firebase.Menu.options.map((item) => {
      return {
        option: new COption(item.option.id, item.option.tag, item.option.diff),
        valid: item.valid,
      };
    }) || []
  );

  useEffect(() => {});

  const handleSubmitClick = () => {
    //console.log(menuOptionsRef.current)

    firebase.Menu.options = menuOptionsRef.current;
    firebase.pushMenuToFirebase(firebase.Menu);

    navigate(-1);
  };

  const handleCancelClick = () => {
    navigate("/");
  };

  const handleReturnClick = () => {
    navigate(-1);
  };

  return (
    <Box sx={{ m: 0 }}>
      <div>
        <OptionList menuOptions={menuOptions} setMenuOptions={setMenuOptions} />

        <IconButton
          sx={{ m: 1 }}
          aria-label="add"
          color="primary"
          onClick={() => {
            setMenuOptions((item) => [
              ...item,
              {
                option: new COption(v4(), "", 0),
                valid: [],
              },
            ]);
          }}
        >
          <AddIcon />
        </IconButton>

        <Stack direction="row" spacing={1} sx={{ mb: 10 }}>
          {/* <Link to="../"> */}
          <div>
            <IconButton
              sx={{ m: 1 }}
              aria-label="return"
              color="primary"
              onClick={handleReturnClick}
            >
              <KeyboardReturnIcon />
            </IconButton>
          </div>
          <div>
            <IconButton
              sx={{ m: 1 }}
              aria-label="cancel"
              color="error"
              onClick={handleCancelClick}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <div>
            <IconButton
              sx={{ m: 1, mx: 6 }}
              aria-label="submit"
              color="success"
              onClick={handleSubmitClick}
            >
              <DoneIcon />
            </IconButton>
          </div>
          {/* </Link> */}
        </Stack>
      </div>
    </Box>
  );
};

export default EditOptions;
