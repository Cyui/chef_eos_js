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
import FolderIcon from "@mui/icons-material/Folder";
import AddIcon from "@mui/icons-material/Add";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import * as firebase from "../../model/firebase";
import { projectKey } from "../../model/projects";
import useAsyncAction from "../../hooks/useAsyncAction";

export default function ProjectSettings() {
  const navigate = useNavigate();
  const [projects, setProjects] = React.useState([]);
  const [selected, setSelected] = React.useState("");
  const [newProject, setNewProject] = React.useState("");
  const [existingProject, setExistingProject] = React.useState("");
  const [validation, setValidation] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState(false);
  const [attempt, retry] = React.useReducer((value) => value + 1, 0);
  const { run, pending, error } = useAsyncAction("專案設定失敗，請重新載入或稍後再試。");
  const disabled = loading || pending || loadError;

  React.useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError(false);
    firebase.refreshProjectSettings().then(
      (settings) => {
        if (!active) return;
        setProjects(settings.projects_available);
        setSelected(settings.projects_available.includes(settings.project_selected) ? settings.project_selected : "");
        setLoading(false);
      },
      () => { if (active) { setLoadError(true); setLoading(false); } },
    );
    return () => { active = false; };
  }, [attempt]);

  const switchProject = () => run(async () => {
    await firebase.changeSelectedProject(selected);
    // Return home; the data gate blocks actions until the new project's data is ready.
    navigate("/", { replace: true });
  });

  const addProject = (allowExisting = false) => {
    setValidation("");
    try { projectKey(newProject); } catch (error) { setValidation(error.message); return; }
    return run(async () => {
      try {
        await firebase.addProject(newProject, { allowExisting });
        navigate("/", { replace: true });
      } catch (error) {
        if (error.code === "project-exists") { setExistingProject(newProject.trim()); return; }
        throw error;
      }
    });
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stack spacing={3} sx={{ mx: 8, my: 4 }}>
        <Typography variant="h6">專案設定</Typography>
        <Typography>目前專案：{firebase.ProjectSelected || "尚未選擇"}</Typography>
        {loading && <Typography role="status">載入專案清單中…</Typography>}
        {loadError && <Alert severity="error" action={<Button onClick={retry}>重試</Button>}>專案清單載入失敗。</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && !loadError && projects.length === 0 && <Alert severity="info">目前沒有可選專案，可新增專案，或在資料庫補上可用專案清單。</Alert>}
        <FormControl fullWidth disabled={disabled || projects.length === 0}>
          <InputLabel id="project-select-label">可用專案</InputLabel>
          <Select labelId="project-select-label" label="可用專案" value={selected} onChange={(event) => setSelected(event.target.value)}>
            {projects.map((project) => <MenuItem key={project} value={project}>{project}</MenuItem>)}
          </Select>
        </FormControl>
        <Button sx={{ py: 2 }} variant="contained" color="primary" size="large" fullWidth
          disabled={disabled || !selected} onClick={switchProject} startIcon={<FolderIcon />}>
          切換專案
        </Button>
        <Typography variant="h6">新增空白專案</Typography>
        <TextField label="新專案" placeholder="例如 2028 或 夏季活動" value={newProject} disabled={disabled}
          error={Boolean(validation)} helperText={validation || "新專案的菜單與訂單皆為空白。"}
          onChange={(event) => { setNewProject(event.target.value); setExistingProject(""); setValidation(""); }} />
        {existingProject && <Alert severity="info">{existingProject} 專案已存在。加入清單並切換會保留既有資料。</Alert>}
        {existingProject && <Button sx={{ py: 2 }} variant="contained" color="primary" size="large" fullWidth
          disabled={disabled} onClick={() => addProject(true)} startIcon={<FolderIcon />}>
          加入並切換至 {existingProject}
        </Button>}
        <Button sx={{ py: 2 }} variant="contained" color="primary" size="large" fullWidth
          disabled={disabled || !newProject.trim()} onClick={() => addProject()} startIcon={<AddIcon />}>
          新增並切換專案
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
