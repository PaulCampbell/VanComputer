import ujson
import urequests
import network
import machine
import time
from micropyGPS import MicropyGPS
import config


class Tracker:
    def __init__(self):
        self.token = str()
        self.uart = machine.UART(1, rx=21, tx=19, baudrate=9600,
                                 bits=8, parity=None, stop=1, timeout=5000, rxbuf=1024)
        self.gps = MicropyGPS(0, 'dd')

    def run(self):
        self.__connect_to_wifi()
        while True:
            buf = self.uart.readline()
            if buf:
                for char in buf:
                    self.gps.update(chr(char))

                print('UTC Timestamp:', self.gps.timestamp)
                print('Date:', self.gps.date_string('long'))
                if(self.__gps_has_signal()):
                    self.__post_data()
                    time.sleep(60)
                else:
                    print('searching for satellites... found: ',
                          self.gps.satellites_in_use)
                    time.sleep(10)
            else:
                print('failed to get uart data')
                time.sleep(10)

            print()

    def __gps_has_signal(self):
        print(self.gps.latitude[0])
        # dumb check to see if we have a signal that looks like it makes sense
        return self.gps.satellites_in_use > 2 and self.gps.latitude[0] != 0.0

    def __get_token(self):
        data = {}
        data['userId'] = config.USER_ID
        token_url = '%s/api/vehicles/%s/token' % (
            config.API_URL, config.VAN_ID)
        payload = ujson.dumps(data)
        print('getting token ', token_url, payload)
        response = urequests.post(
            token_url,
            headers={
                'content-type': 'application/json',
            },
            data=payload

        )
        print(response.status_code)
        response_body = response.json()
        print(response_body)
        self.token = response_body['token']
        return response_body['token']

    def __post_data(self):
        if self.token == str():
            self.__get_token()

        lat = self.gps.latitude[0] if self.gps.latitude[1] == "N" else self.gps.latitude[0] * -1
        long = self.gps.latitude[0] if self.gps.latitude[1] == "E" else self.gps.latitude[0] * -1

        data = {}
        data['location'] = {}
        data['location']['latitude'] = self.gps.latitude
        data['location']['longitude'] = self.gps.longitude
        data['location']['altitude'] = self.gps.altitude
        data['location']['speed'] = self.gps.speed_string('kph')
        payload = ujson.dumps(data)
        data_url = '%s/api/vehicles/%s/data' % (config.API_URL, config.VAN_ID)
        print(payload)

        try:
            response = urequests.post(
                data_url,
                headers={
                    'content-type': 'application/json',
                    'authorization': 'Bearer %s' % (self.token)
                },
                data=payload
            )
            print(response.status_code)
            print(response.text)
        except Exception as inst:
            print(inst)

    def __connect_to_wifi(self):
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
    tracker = Tracker()
    tracker.run()
