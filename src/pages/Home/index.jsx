import * as React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AddIcon from "@mui/icons-material/Add";
import BarChartIcon from "@mui/icons-material/BarChart";
import ListIcon from "@mui/icons-material/List";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { yearLabel } from "../../model/years";
import * as firebase from "../../model/firebase";

const Home = () => {
  const navigate = useNavigate();

  const [error, setError] = React.useState("");

  const handleNewClick = () => {
    navigate("../edit");
  };

  const handleSummaryClick = () => {
    navigate("../summary");
  };

  const handleListClick = () => {
    navigate("../list");
  };

  const handleQueryClick = () => {
    navigate("../query");
  };

  const handleSettingClick = () => {
    navigate("../setting");
  };

  const handleLogoutClick = async () => {
    try {
      await firebase.logOut();
    } catch {
      setError("登出失敗，請稍後再試。");
    }
  };

  return (
    <div>
      <Box sx={{ width: "100%" }}>
        {error && <Alert severity="error">{error}</Alert>}
        <Typography variant="h6" gutterBottom sx={{ m: 1 }}>
          {firebase.Mail}
        </Typography>
        <Typography sx={{ m: 1 }}>目前年度：{yearLabel(firebase.YearSelected)}</Typography>

        <Stack spacing={4} sx={{ mx: 8, my: 4 }}>
          <Button
            sx={{ py: 2 }}
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={handleNewClick}
            startIcon={<AddIcon />}
          >
            新增
          </Button>
          <Button
            sx={{ py: 2 }}
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={handleSummaryClick}
            startIcon={<BarChartIcon />}
          >
            統計
          </Button>
          <Button
            sx={{ py: 2 }}
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={handleListClick}
            startIcon={<ListIcon />}
          >
            列表
          </Button>
          <Button
            sx={{ py: 2 }}
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={handleQueryClick}
            startIcon={<SearchIcon />}
          >
            查詢
          </Button>
          <Button
            sx={{ py: 2 }}
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={handleSettingClick}
            startIcon={<SettingsIcon />}
          >
            設定
          </Button>
          <Button
            sx={{ py: 2 }}
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={handleLogoutClick}
            startIcon={<LogoutIcon />}
          >
            登出
          </Button>
        </Stack>
      </Box>
    </div>
  );
};

export default Home;

