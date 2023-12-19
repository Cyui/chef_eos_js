import React from "react";
import { useEffect } from "react";
import useState from "react-usestateref";
import { useNavigate, Link } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { blue, red, green } from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import "dayjs/locale/zh-tw";
import dayjs from "dayjs";
import * as firebase from "../../model/firebase";

const QueryInput = () => {
  dayjs.locale("zh-tw");

  const navigate = useNavigate();

  const statusList = ["待處理", "已完成"];
  const deliverList = ["自取", "宅配"];
  const noteList = ["", "有備註"];

  const [sn, setSN] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dateFrom, setDateFrom, dateFromRef] = useState("");
  const [timeFrom, setTimeFrom, timeFromRef] = useState("");
  const [dateTo, setDateTo, dateToRef] = useState("");
  const [timeTo, setTimeTo, timeToRef] = useState("");
  const [noteOpt, setNoteOpt] = useState("");
  const [deliver, setDeliver] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    firebase.pullAllInvoiceFromFirebase();
  }, []);

  const handleSelStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleSelDeliverChange = (event) => {
    setDeliver(event.target.value);
  };

  const handleSelNoteOptChange = (event) => {
    setNoteOpt(event.target.value);
  };

  const getFilterResult = () => {
    let result = [...firebase.Invoices];

    if (sn) {
      result = result.filter((item) => item.info.sn.includes(sn));
    }

    if (status) {
      result = result.filter((item) => item.info.status.includes(status));
    }

    if (phone) {
      result = result.filter((item) => item.info.name.includes(name));
    }

    if (phone) {
      result = result.filter((item) => item.info.phone.includes(phone));
    }

    if (deliver) {
      result = result.filter((item) => item.info.deliver.includes(deliver));
    }

    if (noteOpt) {
      result = result.filter((item) => item.info.note !== "");
    }

    if (dateFrom) {
      if (!dateTo) {
        setDateTo(dateFrom);
      }
      if (!timeFrom) {
        setTimeFrom("00:00");
      }
      if (!timeTo) {
        setTimeTo("24:00");
      }

      let dtFrom = dateFromRef.current + "T" + timeFromRef.current;
      let dtTo = dateToRef.current + "T" + timeToRef.current;

      //console.log(dtFrom, dtTo)

      result = result.filter((item) => {
        let dt = item.info.date + "T" + item.info.time;

        // Parameter 4 is a string with two characters; '[' means inclusive, '(' exclusive
        // '()' excludes start and end date (default)
        // '[]' includes start and end date
        // '[)' includes the start date but excludes the stop
        return dayjs(dt).isBetween(dtFrom, dtTo, null, "[)");
      });
    }

    return firebase.setInvoices(result);
  };

  const handleQuerySummaryClick = () => {
    navigate("../summary", { state: getFilterResult() });
  };

  const handleQueryInvoiceClick = () => {
    navigate("../list", { state: getFilterResult() });
  };

  function convertToDateString(date) {
    return dayjs(date).format("YYYY/MM/DD");
  }
  function convertToTimeString(time) {
    return dayjs(time).format("HH:mm");
  }

  return (
    <div>
      <Stack direction="row" spacing={1} sx={{ m: 1 }}>
        <div>
          <TextField
            sx={{ width: 164 }}
            id="textNo"
            label="編號"
            variant="outlined"
            fullWidth
            value={sn}
            onChange={(e) => {
              setSN(e.target.value);
            }}
          />
        </div>

        <div>
          <FormControl>
            <InputLabel id="label_status">訂單狀態</InputLabel>
            <Select
              labelId="label_status"
              id="status_select"
              sx={{ width: 164 }}
              value={status}
              label="訂單狀態"
              onChange={handleSelStatusChange}
            >
              {statusList.map((item) => {
                return (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ m: 1 }}>
        <div>
          <TextField
            sx={{ width: 164 }}
            id="textName"
            label="姓名"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <div>
          <TextField
            sx={{ width: 164 }}
            id="textPhone"
            label="電話"
            variant="outlined"
            fullWidth
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
            }}
          />
        </div>
      </Stack>
      <Stack direction="row" spacing={1} sx={{ m: 1 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-tw">
          <DatePicker
            sx={{ width: 164 }}
            label="取貨日期(起)"
            value={dateFrom}
            onChange={(value) => {
              setDateFrom(convertToDateString(value));
            }}
          />
          <TimePicker
            sx={{ width: 164 }}
            label="取貨時間(起)"
            value={timeFrom}
            onChange={(value) => {
              setTimeFrom(convertToTimeString(value));
            }}
          />
        </LocalizationProvider>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ m: 1 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-tw">
          <DatePicker
            sx={{ width: 164 }}
            label="取貨日期(迄)"
            value={dateTo}
            onChange={(value) => {
              setDateTo(convertToDateString(value));
            }}
          />
          <TimePicker
            sx={{ width: 164 }}
            label="取貨時間(迄)"
            value={timeTo}
            onChange={(value) => {
              setTimeTo(convertToTimeString(value));
            }}
          />
        </LocalizationProvider>
      </Stack>
      <Stack direction="row" spacing={1} sx={{ m: 1 }}>
        <div>
          <FormControl>
            <InputLabel id="label_deliver">取貨方式</InputLabel>
            <Select
              labelId="label_deliver"
              id="deliver_select"
              sx={{ width: 164 }}
              value={deliver}
              label="取貨方式"
              onChange={handleSelDeliverChange}
            >
              {deliverList.map((item) => {
                return (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>

        <div>
          <FormControl>
            <InputLabel id="label_note">備註</InputLabel>
            <Select
              labelId="label_note"
              id="note_select"
              sx={{ width: 164 }}
              defaultValue=""
              value={noteOpt}
              label="備註"
              onChange={handleSelNoteOptChange}
            >
              {noteList.map((item) => {
                return (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
      </Stack>

      <Stack direction="row" spacing={1}>
        {/* <Link to="../"> */}
        <div>
          <IconButton
            sx={{ m: 1, my: 2 }}
            aria-label="return"
            color="primary"
            onClick={() => {
              navigate(-1);
            }}
          >
            <KeyboardReturnIcon />
          </IconButton>
        </div>
        {/* </Link> */}
        <div>
          <Button
            sx={{ m: 1, ml: 6, my: 2 }}
            variant="outlined"
            color="primary"
            onClick={handleQuerySummaryClick}
          >
            查詢統計
          </Button>
        </div>
        <div>
          <Button
            sx={{ m: 1, my: 2  }}
            variant="outlined"
            color="primary"
            onClick={handleQueryInvoiceClick}
          >
            查詢訂單
          </Button>
        </div>
      </Stack>

      {/* <Stack direction="row" spacing={1} sx={{ width: 336 }}>
        <div>
          <Link to="../">
            <Button
              variant="contained"
              color="primary"
              sx={{ m: 1, py: 1.5 }}
              onClick={() => {}}
            >
              上一頁
            </Button>
          </Link>
        </div>
        <div>
          <Button
            sx={{ m: 1, px: 2, py: 1.5 }}
            variant="contained"
            color="primary"
            onClick={handleQuerySummaryClick}
          >
            查詢統計
          </Button>
        </div>
        <div>
          <Button
            sx={{ m: 1, px: 2, py: 1.5 }}
            variant="contained"
            color="primary"
            onClick={handleQueryInvoiceClick}
          >
            查詢訂單
          </Button>
        </div>
      </Stack> */}
    </div>
  );
};

export default QueryInput;
