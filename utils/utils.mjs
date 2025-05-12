// yarn add moment
import moment from "moment";
const getCurrentTime = () => {
  const now = moment().format("YYYY-MM-DD HH:mm:ss");
  return now;
};

export { getCurrentTime };
