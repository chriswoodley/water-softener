require('dotenv').config();
const path = require('path')
const {spawn} = require('child_process');
const api = require('losant-rest');
const client = api.createClient();

client.auth.authenticateDevice({ credentials: {
  deviceId: process.env.DEVICE_ID,
  key: process.env.ACCESS_KEY,
  secret: process.env.ACCESS_SECRET
}}).then(function (response) {
  client.setOption('accessToken', response.token);
  const appId = response.applicationId;

  return new Promise((resolve, reject) => {
    const pathToDistanceScript = path.resolve(__dirname, 'distance.py');
    const python = spawn('python3', [pathToDistanceScript]);
    const state = { data: { distance: null } };

    python.stdout.on('data', function (data) {
      state.data.distance = parseFloat(data.toString(), 10);
    });
  
    python.on('close', (code) => {
      client.device.sendState({
        deviceId: process.env.DEVICE_ID,
        applicationId: appId,
        deviceState: state
      })
      .then((response) => resolve(response))
      .catch((error) => reject(error))
    });
  });
})
.then(function (response) {
  console.log(response); // { success: true }
})
.catch(function (error) {
  console.error(error);
});