# Water Softener Application

This is a small app that will measure the distance from underneath the water softener lid down to the top of the salt pile. When a certain distance is recorded, I will be notified to refill the water softener unit with more salt.

## Implementation Details

This app will run once every week and report the distance using PM2. PM2 is a daemon process manager that will keep the app running 24/7.

The following PM2 commands are used to start, stop, and monitor the daemon process:

`pm2 start src/app.js --restart-delay 604800000`

`604800000` is equivalent to 7 days in milliseconds.

To run with environment variables:

```
DEVICE_ID=xxx ACCESS_KEY=xxx ACCESS_SECRET=xxx pm2 start ${pathtoyourapp}/app.js --restart-delay 10000 --update-env
```

`pm2 monit`

This will print a graphical ui in the terminal that shows realtime process data. This command is good for debugging what is going on with the app.

`pm2 stop src/app.js`

This will stop the deaemon process altogether.

I created a python script in `src/distance.py` that utilizes the built in `gpiozero` library. It exports `DistanceSensor` module which is used to read data from the gpio pins that are used to connect the sensor to the RasberryPI.

The app itself is written in javaScript and it calls the python script when it needs a distance measured. The measurement is then sent to Losant Platform.

The Losant application workflow will be triggered when it receives a new state from my RasberryPI. The workflow will email me when a certain distance has been reported.