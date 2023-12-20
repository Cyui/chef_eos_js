import React from "react";
import { useState, useRef, useEffect } from "react";
import Button from "@mui/material/Button";
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
import "dayjs/locale/zh-tw";
import dayjs from "dayjs";
import { CInfo, CInvoice, COrder } from "../../../model/invoice";

const EditInfo = ({ setOrders, info, setInfo }) => {
  dayjs.locale("zh-tw");

  const statusList = ["待處理", "已完成"];
  const deliverList = ["自取", "宅配"];

  const [sn, setNo] = useState(info.sn);
  const [name, setName] = useState(info.name);
  const [phone, setPhone] = useState(info.phone);
  const [date, setDate] = useState(dayjs(info.date, "YYYY/MM/DD"));
  const [time, setTime] = useState(dayjs(info.time, "HH:mm"));
  const [note, setNote] = useState(info.note);
  const [deposit, setDeposit] = useState(info.deposit);
  const [deliver, setDeliver] = useState(info.deliver || "自取");
  const [status, setStatus] = useState(info.status || "待處理");

  useEffect(() => {}, []);

  const handleSelStatusChange = (event) => {
    setStatus(event.target.value);
    setInfo((info) => {
      // info.status = event.target.value;
      return { ...info, status: event.target.value };
    });
  };

  const handleSelDeliverChange = (event) => {
    setDeliver(event.target.value);
    setInfo((info) => {
      return { ...info, deliver: event.target.value };
    });
  };

  const handleAddClick = () => {
    setOrders((order) => {
      return [...order, new COrder()];
    });
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
              setNo(e.target.value);
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
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
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
              setDate(convertToDateString(value));
              setInfo((info) => {
                return { ...info, date: convertToDateString(value) };
              });
            }}
          />
          <TimePicker
            label="取貨時間"
            sx={{ width: 164 }}
            value={time}
            onChange={(value) => {
              setTime(convertToTimeString(value));
              setInfo((info) => {
                return { ...info, time: convertToTimeString(value) };
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
          <TextField
            sx={{ width: 164 }}
            id="textDeposit"
            label="訂金"
            variant="outlined"
            fullWidth
            value={deposit}
            onChange={(e) => {
              setDeposit(Number(e.target.value) || 0);
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
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              setInfo((info) => {
                return { ...info, note: e.target.value };
              });
            }}
          />
        </div>
      </Stack>

      <IconButton
        sx={{ m: 1 }}
        aria-label="add"
        color="primary"
        onClick={handleAddClick}
      >
        <AddIcon />
      </IconButton>
    </div>
  );
};

export default EditInfo;
