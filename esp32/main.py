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
      if(gps.satellites_in_use > 2):
        print('Latitude:', gps.latitude)
        print('Longitude:', gps.longitude_string())
        print('Horizontal Dilution of Precision:', gps.hdop)
        print('Altitude:', gps.altitude)
        print('Satellites:', gps.satellites_in_use)
      else:
        print('searching for satellites... found: ', gps.satellites_in_use)
      print()
      time.sleep(5)

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
