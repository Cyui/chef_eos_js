import * as React from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AddIcon from "@mui/icons-material/Add";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import * as firebase from "../../model/firebase";
import { yearKey, yearLabel } from "../../model/years";
import useAsyncAction from "../../hooks/useAsyncAction";

export default function YearSettings() {
  const navigate = useNavigate();
  const [years, setYears] = React.useState([]);
  const [selected, setSelected] = React.useState("");
  const [newYear, setNewYear] = React.useState("");
  const [existingYear, setExistingYear] = React.useState("");
  const [validation, setValidation] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState(false);
  const [attempt, retry] = React.useReducer((value) => value + 1, 0);
  const { run, pending, error } = useAsyncAction("年度設定失敗，請重新載入或稍後再試。");
  const disabled = loading || pending || loadError;

  React.useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError(false);
    firebase.refreshYearSettings().then(
      (settings) => {
        if (!active) return;
        setYears(settings.years_available);
        setSelected(settings.years_available.includes(settings.year_selected) ? settings.year_selected : "");
        setLoading(false);
      },
      () => { if (active) { setLoadError(true); setLoading(false); } },
    );
    return () => { active = false; };
  }, [attempt]);

  const switchYear = () => run(async () => {
    await firebase.changeSelectedYear(selected);
    // Return home; the data gate blocks actions until the new year's data is ready.
    navigate("/", { replace: true });
  });

  const addYear = (allowExisting = false) => {
    setValidation("");
    try { yearKey(newYear); } catch (error) { setValidation(error.message); return; }
    return run(async () => {
      try {
        await firebase.addYear(newYear, { allowExisting });
        navigate("/", { replace: true });
      } catch (error) {
        if (error.code === "year-exists") { setExistingYear(newYear.trim()); return; }
        throw error;
      }
    });
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stack spacing={3} sx={{ mx: 8, my: 4 }}>
        <Typography variant="h6">年度資料設定</Typography>
        <Typography>目前年度：{yearLabel(firebase.YearSelected)}</Typography>
        {loading && <Typography role="status">載入年度清單中…</Typography>}
        {loadError && <Alert severity="error" action={<Button onClick={retry}>重試</Button>}>年度清單載入失敗。</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && !loadError && years.length === 0 && <Alert severity="info">目前沒有可選年度，可新增年度，或在資料庫補上可用年度清單。</Alert>}
        <FormControl fullWidth disabled={disabled || years.length === 0}>
          <InputLabel id="year-select-label">可用年度</InputLabel>
          <Select labelId="year-select-label" label="可用年度" value={selected} onChange={(event) => setSelected(event.target.value)}>
            {years.map((year) => <MenuItem key={year} value={year}>{yearLabel(year)}</MenuItem>)}
          </Select>
        </FormControl>
        <Button sx={{ py: 2 }} variant="contained" color="primary" size="large" fullWidth
          disabled={disabled || !selected} onClick={switchYear} startIcon={<CalendarMonthIcon />}>
          切換年度
        </Button>
        <Typography variant="h6">新增空白年度</Typography>
        <TextField label="新年度" placeholder="例如 2028" value={newYear} disabled={disabled}
          error={Boolean(validation)} helperText={validation || "新年度的菜單與訂單皆為空白。"}
          slotProps={{ htmlInput: { inputMode: "numeric", maxLength: 4 } }}
          onChange={(event) => { setNewYear(event.target.value); setExistingYear(""); setValidation(""); }} />
        {existingYear && <Alert severity="info">{existingYear} 年度已存在。加入清單並切換會保留既有資料。</Alert>}
        {existingYear && <Button sx={{ py: 2 }} variant="contained" color="primary" size="large" fullWidth
          disabled={disabled} onClick={() => addYear(true)} startIcon={<CalendarMonthIcon />}>
          加入並切換至 {existingYear}
        </Button>}
        <Button sx={{ py: 2 }} variant="contained" color="primary" size="large" fullWidth
          disabled={disabled || !newYear.trim()} onClick={() => addYear()} startIcon={<AddIcon />}>
          新增並切換年度
        </Button>
      </Stack>
      <Stack direction="row" spacing={1} sx={{ mb: 10 }}>
        <IconButton sx={{ m: 1 }} aria-label="返回設定" color="primary"
          disabled={pending} onClick={() => navigate("/setting", { replace: true })}>
          <KeyboardReturnIcon />
        </IconButton>
      </Stack>
    </Box>
  );
}
