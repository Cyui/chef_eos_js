import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/zh-tw";

dayjs.extend(customParseFormat);
dayjs.locale("zh-tw");
export default dayjs;
