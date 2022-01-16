import ujson
import urequests
import network
import machine
import time
from micropyGPS import MicropyGPS
import config



def main():
    uart = machine.UART(1, rx=21, tx=19, baudrate=9600, bits=8, parity=None, stop=1, timeout=5000, rxbuf=1024)
    gps = MicropyGPS(0, 'dd')
    connect_to_wifi()

    while True:
      buf = uart.readline()

      for char in buf:
        gps.update(chr(char))  # Note the conversion to to chr, UART outputs ints normally

      print('UTC Timestamp:', gps.timestamp)
      print('Date:', gps.date_string('long'))
      if(gps_has_signal(gps)):
        post_data(gps)
      else:
        print('searching for satellites... found: ', gps.satellites_in_use)
      print()
      time.sleep(10)

def gps_has_signal(gps):
    print(gps.latitude[0])
    return gps.satellites_in_use > 2 and gps.latitude[0] != 0.0

def get_token():
    data={}
    data['userId'] = config.USER_ID
    token_url = '%s/vehicles/%s/register'%(config.API_URL, config.VAN_ID)
    print('getting token ', token_url)
    response = urequests.post(
            token_url,
            headers = {
                'content-type': 'application/json',
            },
            data = ujson.dumps(data)

        )
    response_body = response.json()
    print(response_body)
    return response_body['token']

def post_data(gps):
    token = get_token()

    data={}
    data['location'] = {}
    data['location']['latitude'] = gps.latitude
    data['location']['longitude'] = gps.longitude
    data['location']['altitude'] = gps.altitude
    data['location']['speed'] = gps.speed_string('kph')
    payload = ujson.dumps(data)
    data_url = '%s/vehicles/%s/data'%(config.API_URL, config.VAN_ID)

    response = urequests.post(
            data_url,
            headers = {
                'content-type': 'application/json',
                'authorization': 'Bearer %s'%(token)
            },
            data = payload
    )


def connect_to_wifi():
    sta_if = network.WLAN(network.STA_IF)
    if not sta_if.isconnected():
        print('connecting to network...')
        sta_if.active(True)
        sta_if.connect(config.ESSID, config.WIFI_PASSWORD)
        while not sta_if.isconnected():
            pass
    print('network config:', sta_if.ifconfig())

if __name__ == "__main__":
  print('...running main, Van Computer')
  main()
