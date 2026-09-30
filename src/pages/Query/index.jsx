import * as React from "react";
import { useNavigate } from "react-router-dom";
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
import IconButton from "@mui/material/IconButton";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import dayjs from "../../model/date";
import * as firebase from "../../model/firebase";
import { filterInvoices } from "../../model/query";
import Alert from "@mui/material/Alert";
import useAsyncAction from "../../hooks/useAsyncAction";

const QueryInput = () => {
  const navigate = useNavigate();

  const statusList = ["待處理", "已完成"];
  const deliverList = ["自取", "宅配"];
  const noteList = ["", "有備註"];

  const [sn, setSN] = React.useState("");
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [dateFrom, setDateFrom] = React.useState(null);
  const [timeFrom, setTimeFrom] = React.useState(dayjs("00:00", "HH:mm"));
  const [dateTo, setDateTo] = React.useState(null);
  const [timeTo, setTimeTo] = React.useState(dayjs("23:00", "HH:mm"));
  const [noteOpt, setNoteOpt] = React.useState("");
  const [deliver, setDeliver] = React.useState("");
  const [status, setStatus] = React.useState("");

  const { run, pending, error } = useAsyncAction("查詢失敗，請確認日期時間範圍或稍後再試。");

  const handleSelStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleSelDeliverChange = (event) => {
    setDeliver(event.target.value);
  };

  const handleSelNoteOptChange = (event) => {
    setNoteOpt(event.target.value);
  };

  const handleQuery = (path) => run(async () => {
    const invoices = await firebase.pullAllInvoiceFromFirebase();
    const result = filterInvoices(invoices, { sn, name, phone, status, deliver, noteOpt, dateFrom, timeFrom, dateTo, timeTo });
    navigate(path, { state: { invoiceIds: result.map((item) => item.id) } });
  });
  const handleQuerySummaryClick = () => handleQuery("../summary");
  const handleQueryInvoiceClick = () => handleQuery("../list");

  return (
    <div>
      {error && <Alert severity="error">{error}</Alert>}
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
              setDateFrom(value);
              setDateTo(value);
            }}
          />
          <TimePicker
            sx={{ width: 164 }}
            label="取貨時間(起)"
            value={timeFrom}
            onChange={(value) => {
              setTimeFrom(value);
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
              setDateTo(value);
            }}
          />
          <TimePicker
            sx={{ width: 164 }}
            label="取貨時間(迄)"
            value={timeTo}
            onChange={(value) => {
              setTimeTo(value);
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

        <div>
          <Button
            sx={{ m: 1, ml: 6, my: 2 }}
            variant="outlined"
            color="primary"
            onClick={handleQuerySummaryClick} disabled={pending}
          >
            查詢統計
          </Button>
        </div>
        <div>
          <Button
            sx={{ m: 1, my: 2 }}
            variant="outlined"
            color="primary"
            onClick={handleQueryInvoiceClick} disabled={pending}
          >
            查詢訂單
          </Button>
        </div>
      </Stack>
    </div>
  );
};

export default QueryInput;

