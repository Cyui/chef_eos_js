import * as React from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import dayjs from "../../../model/date";
import { COrder } from "../../../model/invoice";

const EditInfo = ({ setOrders, info, setInfo }) => {

  const statusList = ["待處理", "已完成"];
  const deliverList = ["自取", "宅配"];

  const date = info.date ? dayjs(info.date, "YYYY/MM/DD", true) : null;
  const time = info.time ? dayjs(info.time, "HH:mm", true) : null;
  const handleSelStatusChange = (event) => {
    const status = event.target.value;
    setInfo((info) => ({ ...info, status }));
  };
  const handleSelDeliverChange = (event) => {
    const deliver = event.target.value;
    setInfo((info) => ({ ...info, deliver }));
  };
  const handleAddClick = () => {
    setOrders((order) => {
      return [...order, new COrder()];
    });
  };

  function convertToDateString(date) {
    return date?.isValid() ? date.format("YYYY/MM/DD") : "";
  }
  function convertToTimeString(time) {
    return time?.isValid() ? time.format("HH:mm") : "";
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
            value={info.sn}
            onChange={(e) => {
              setInfo((info) => {
                return { ...info, sn: e.target.value };
              });
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
              value={info.status}
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
            value={info.name}
            onChange={(e) => {
              setInfo((info) => {
                return { ...info, name: e.target.value };
              });
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
            value={info.phone}
            onChange={(e) => {
              setInfo((info) => {
                return { ...info, phone: e.target.value };
              });
            }}
          />
        </div>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ m: 1 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-tw">
          <DatePicker
            label="取貨日期"
            sx={{ width: 164 }}
            value={date}
            onChange={(value) => {
              setInfo((info) => {
                return { ...info, date: convertToDateString(value || null) };
              });
            }}
          />
          <TimePicker
            label="取貨時間"
            sx={{ width: 164 }}
            value={time}
            onChange={(value) => {
              setInfo((info) => {
                return { ...info, time: convertToTimeString(value || null) };
              });
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
              value={info.deliver}
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
          <TextField
            sx={{ width: 164 }}
            id="textDeposit"
            label="訂金"
            variant="outlined"
            fullWidth
            value={info.deposit}
            onChange={(e) => {
              setInfo((info) => {
                return { ...info, deposit: Number(e.target.value) || 0 };
              });
            }}
          />
        </div>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ m: 1 }}>
        <div>
          <TextField
            sx={{ width: 336 }}
            id="textNote"
            label="備註"
            variant="outlined"
            fullWidth
            value={info.note}
            onChange={(e) => {
              setInfo((info) => {
                return { ...info, note: e.target.value };
              });
            }}
          />
        </div>
      </Stack>

      <IconButton sx={{ m: 1 }} aria-label="add" color="primary" onClick={handleAddClick}>
        <AddIcon />
      </IconButton>
    </div>
  );
};

export default EditInfo;

