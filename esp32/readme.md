# ESP32 Van Computer firmware

This is some code for esp32 to interact with the Van Computer API.  It sends GPS coordinates (and probably other data) to the API so you can see where your van is (and probably other things).

It's tested on a knock off TTGO, a bit like (this one)[https://www.amazon.co.uk/TTGO-T-Call-Wireless-Antenna-SIM800L-M5Stick/dp/B07VFPBRJ4] (except it's a knock off...) connected to a (NEO 6m GPS thing)[https://www.ebay.co.uk/itm/402304782548] as I had those lying around.

Here's roughly what it does when you boot it:

  1) Connects to you wifi
  2) Calls `[API_URL]/vehicles/[VAN_ID]/register` to get a json web token for the API
  3) Finds a bunch of satellites and gets its GPS coordinates
  4) Post data to `[API_URL]/vehicles/[VAN_ID]/data`
  5) Sleep for a bit
  6) Go to 3


## Create a virtual environment and activate it

```
mkdir venv
python3 -m venv ./venv
source venv/bin/activate
pip install -r ./requirements.txt
```


## Flash micropython to device

If you're putting micropyhton on the board for the first time, you'll need to erase the falsh first:

`esptool.py --chip esp32 --port /dev/{your_serial_port} erase_flash`

then:

`esptool.py --chip esp32 --port /dev/{your_serial_port} --baud 460800 write_flash -z 0x1000 esp32-20210902-v1.17.bin`


## Edit the config file

The file [config.py](config.py) is gonna need some settings:

  - ESSID: your van wifi network id
  - WIFI_PASSWORD: your van wifi password
  - VAN_ID: The ID given to you when you register a device on the website
  - API_URL: The url of the API your sending the data to. If you're using the hosted site you probably don't need to change this

You probably also want to edit the (rx and tx pins)[add github link] on the GPS module.

## Upload the codes to the device

```
ampy  --port /dev/{your_serial_port} put boot.py
ampy  --port /dev/{your_serial_port} put main.py
ampy  --port /dev/{your_serial_port} put micropyGPS.py
ampy  --port /dev/{your_serial_port} put config.py
```

## Debugging

Connect to the thing with screen to get a bunch of logs, yeah?

```
screen /dev/{your_serial_port} 115200
```

