import sys
# from types import GeneratorType

import responses

# import test as _test
import googlemaps
# import urllib2
import json
# import MySQLdb
import geocoder
import requests
from math import sin, cos, sqrt, atan2, radians

# db = MySQLdb.connect(host="localhost",    # your host, usually localhost
#                      user="root",         # your username
#                      passwd="root",  # your password
#                      db="casehack")
# cur = db.cursor()
# print( "happened")
#
# msg = ""
# for line in sys.stdin:
#   msg = msg + line[:-1]
#
# # print(msg)
# message = json.loads(msg)
# identifier = message["profID"]
# address = message["addr"]
# print(identifier)
# print(address)
#
# # now I have the address and their profile ID
# # build a 'value' profile for this address
# # must look at what this person values
# # ------------------------------------------------------------------
# # get the profiles PK
# sql = 'SELECT id FROM registered_users WHERE identity = \"' + identifier+ '\"'
# cur.execute(sql)
# for row in cur.fetchall():
#     pk = row[0]
# # print(pk)
#
# # now I have their pk
# # get their most frequent words from transactions
# sql = 'SELECT category FROM user_profiles WHERE profile_id =' + str(6) + ' ORDER BY frequency DESC '
# cur.execute(sql)
#
# frequenchy = []
# for row in cur.fetchall():
#     frequenchy.append(row[0])

# print(frequenchy[0])
frequenchy = "restaurant"
address = "3480 Kent Road Stow Ohio"
g = geocoder.google(address)

def calcDistance(g, loc2):
    R = 6373.0
    lat1 = radians(g.lat)
    lng1 = radians(g.lng)
    lat2 = radians(loc2['lat'])
    lng2 = radians(loc2['lng'])

    dlon = lng2 - lng1
    dlat = lat2 - lat1
    a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    # convert to miles
    conv_fac = 0.621371
    distance = conv_fac * R * c
    return distance


geocoded = '' + str(g.lat) + ','+ str(g.lng)
url = 'https://maps.googleapis.com/maps/api/place/textsearch/json'
# print(params)
params = {'language':'en', 'location=' : geocoded, 'query':frequenchy, 'radius':'100', 'key':'AIzaSyAe-_fUznUY7EH9JMJ-SAsstofiMcb0qRE'}
# params = {'rankby':'distance', 'key':'AIzaSyAe-_fUznUY7EH9JMJ-SAsstofiMcb0qRE'}
r = requests.get(url, params=params)
# print(r)
results = r.json()['results']
# print(results)
i = 0
while i < 4:
    print(address)
    print(results[i]["geometry"]["location"])
    print(calcDistance(g, results[i]["geometry"]["location"] ))
    print(results[i]["rating"])
    i = i + 1

#
# url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?language=en-AU&'
# location = 'location=-33.867460,151.207090&'
# price_range = 'maxprice=4&minprice=1&'
# open_now = 'opennow=true&'
# query = 'query=restaurant&'
# radius = 'radius=100&'
# key = 'key=AIzaSyAe-_fUznUY7EH9JMJ-SAsstofiMcb0qRE'
# final = url + location + price_range + open_now + query + radius + key
# print(final)
# response = urllib2.urlopen(final)
# html = response.read()
# d = json.loads(html)
# print(d["results"])
