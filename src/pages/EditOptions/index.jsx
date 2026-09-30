import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import OptionList from "./components/OptionList";
import { useNavigate } from "react-router-dom";
import { COption } from "../../model/invoice";
import * as firebase from "../../model/firebase";
import { v4 } from "uuid";

import Alert from "@mui/material/Alert";
import useAsyncAction from "../../hooks/useAsyncAction";

const EditOptions = () => {
  const navigate = useNavigate();

  const [menuOptions, setMenuOptions] = React.useState(() => firebase.Menu.options.map((item) => ({ option: new COption(item.option.id, item.option.tag, item.option.diff), valid: [...item.valid] })));
  const { run, pending, error } = useAsyncAction("儲存失敗，請稍後再試。");

  const handleSubmitClick = () => run(async () => {
    await firebase.pushMenuToFirebase({ ...firebase.Menu, options: menuOptions });
    navigate(-1);
  });

  const handleCancelClick = () => {
    navigate("/");
  };

  const handleReturnClick = () => {
    navigate(-1);
  };

  return (
    <Box sx={{ m: 0 }}>
      {error && <Alert severity="error">{error}</Alert>}
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
                    <div>
            <IconButton
              sx={{ m: 1 }}
              aria-label="return"
              color="primary"
              onClick={handleReturnClick} disabled={pending}
            >
              <KeyboardReturnIcon />
            </IconButton>
          </div>
          <div>
            <IconButton sx={{ m: 1 }} aria-label="cancel" color="error" onClick={handleCancelClick} disabled={pending}>
              <CloseIcon />
            </IconButton>
          </div>
          <div>
            <IconButton
              sx={{ m: 1, mx: 6 }}
              aria-label="submit"
              color="success"
              onClick={handleSubmitClick}
              disabled={pending}
            >
              <DoneIcon />
            </IconButton>
          </div>
                  </Stack>
      </div>
    </Box>
  );
};

export default EditOptions;

