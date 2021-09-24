#!/usr/bin/env python3

from time import sleep
from gpiozero import DistanceSensor

dist_sensor = DistanceSensor(echo=23, trigger=24, max_distance=4)
print(dist_sensor.distance * 100, end='')