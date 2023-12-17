import React from "react";
import { useEffect } from "react";
import useState from "react-usestateref";
import { useNavigate, Link } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/zh-tw";
import dayjs from "dayjs";
import * as firebase from "../../model/firebase";

const QueryInput = () => {
  dayjs.locale("zh-tw");

  const navigate = useNavigate();

  const statusList = ["待處理", "已完成"];
  const deliverList = ["自取", "宅配"];
  const noteList = ["有備註"];

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

  useEffect(() => {});

  const handleSelStatusChange = (e, value) => {
    setStatus(value);
  };

  const handleSelDeliverChange = (_, value) => {
    setDeliver(value);
  };

  const handleSelNoteOptChange = (_, value) => {
    setNoteOpt(value);
  };

  const getFilterResult = () => {
    let result = [...firebase.invoices];

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

    return result;
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
      <Stack direction="row" spacing={1}>
        <div>
          <TextField
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
          <Autocomplete
            sx={{ width: 194 }}
            options={statusList}
            value={status || null}
            onChange={handleSelStatusChange}
            renderInput={(params) => <TextField {...params} label="訂單狀態" />}
          />
        </div>
      </Stack>

      <Stack direction="row" spacing={1}>
        <div>
          <TextField
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
      <Stack direction="row" spacing={1}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-tw">
          <DatePicker
            label="取貨日期(起)"
            sx={{ width: 194 }}
            value={dateFrom}
            onChange={(value) => {
              setDateFrom(convertToDateString(value));
            }}
          />
          <TimePicker
            label="取貨時間(起)"
            sx={{ width: 194 }}
            value={timeFrom}
            onChange={(value) => {
              setTimeFrom(convertToTimeString(value));
            }}
          />
        </LocalizationProvider>
      </Stack>

      <Stack direction="row" spacing={1}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-tw">
          <DatePicker
            label="取貨日期(迄)"
            sx={{ width: 194 }}
            value={dateTo}
            onChange={(value) => {
              setDateTo(convertToDateString(value));
            }}
          />
          <TimePicker
            label="取貨時間(迄)"
            sx={{ width: 194 }}
            value={timeTo}
            onChange={(value) => {
              setTimeTo(convertToTimeString(value));
            }}
          />
        </LocalizationProvider>
      </Stack>
      <Stack direction="row" spacing={1}>
        <div>
          <Autocomplete
            sx={{ width: 194 }}
            options={deliverList}
            value={deliver || null}
            onChange={handleSelDeliverChange}
            renderInput={(params) => <TextField {...params} label="取貨方式" />}
          />
        </div>

        <div>
          <Autocomplete
            sx={{ width: 194 }}
            options={noteList}
            value={noteOpt || null}
            onChange={handleSelNoteOptChange}
            renderInput={(params) => <TextField {...params} label="備註" />}
          />
        </div>
      </Stack>

      <Link to="../">
        <Button variant="contained" color="primary" onClick={() => {}}>Cancel</Button>
      </Link>

      <Button
        variant="contained"
        color="primary"
        onClick={handleQuerySummaryClick}
      >
        Query Summary
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleQueryInvoiceClick}
      >
        Query Invoice
      </Button>
    </div>
  );
};

export default QueryInput;
