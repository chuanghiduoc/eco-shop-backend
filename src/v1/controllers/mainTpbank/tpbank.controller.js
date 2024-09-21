const { handleLogin, getHistories } = require("../../services/mainTpbank/tpbank.service");

let accessToken = null;
let refreshTokenTimeout = null; 
let accessTokenExpiry = null;

const getHistoriesTpbank = async (req, res) => {
  try {
    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;
    const deviceId = process.env.DEVICE_ID;
    const accountId = process.env.ACCOUNT_ID;

    if (!username || !password || !deviceId || !accountId) {
      return res.status(400).json({ error: "Thiếu tham số bắt buộc" });
    }

    // Nếu chưa có token hoặc token đã hết hạn thì đăng nhập lại
    if (!accessToken || Date.now() >= accessTokenExpiry) {
      console.log('Token hết hạn hoặc chưa có, đang đăng nhập lại...');
      const loginResponse = await handleLogin(username, password, deviceId);
      accessToken = loginResponse.access_token;
      accessTokenExpiry = Date.now() + (loginResponse.expires_in - 10) * 1000;
      // Đặt thời gian chờ để làm mới token
      if (refreshTokenTimeout) {
        clearTimeout(refreshTokenTimeout);
      }
      refreshTokenTimeout = setTimeout(async () => {
        try {
          console.log('Token hết hạn, đang đăng nhập lại...');
          const newLoginResponse = await handleLogin(username, password, deviceId);
          accessToken = newLoginResponse.access_token;
          accessTokenExpiry = Date.now() + (newLoginResponse.expires_in - 10) * 1000;
        } catch (error) {
          console.error('Lỗi khi làm mới token:', error.message);
        }
      }, (loginResponse.expires_in - 10) * 1000);
    }
    console.log(accessToken);

    // Lấy lịch sử giao dịch sử dụng token từ đăng nhập
    const histories = await getHistories(accessToken, accountId, deviceId, username, password);

    //Lấy dữ liệu ở trường creditDebitIndicator = CRDT (Nhận tiền), DBIT(Chuyển tiền đi) 
    const filteredTransactions = histories.transactionInfos.filter(transaction => transaction.creditDebitIndicator === 'CRDT');

    return res.json({ info: filteredTransactions });

  } catch (error) {
    return res.status(error.response ? error.response.status : 500).json({ error: error.message });
  }
};

// setInterval(getHistoriesTpbank, 60000);

module.exports = {
  getHistoriesTpbank
};