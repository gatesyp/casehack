import sys
from types import GeneratorType

import responses

import test as _test
import googlemaps
import urllib2
import json
import MySQLdb
import geocoder
import requests

db = MySQLdb.connect(host="localhost",    # your host, usually localhost
                     user="root",         # your username
                     passwd="root",  # your password
                     db="casehack")
cur = db.cursor()
print( "happened")

msg = ""
for line in sys.stdin:
  msg = msg + line[:-1]

# print(msg)
message = json.loads(msg)
identifier = message["profID"]
address = message["addr"]
print(identifier)
print(address)

# now I have the address and their profile ID
# build a 'value' profile for this address
# must look at what this person values
# ------------------------------------------------------------------
# get the profiles PK
sql = 'SELECT id FROM registered_users WHERE identity = \"' + identifier+ '\"'
cur.execute(sql)
for row in cur.fetchall():
    pk = row[0]
# print(pk)

# now I have their pk
# get their most frequent words from transactions
sql = 'SELECT category FROM user_profiles WHERE profile_id =' + str(6) + ' ORDER BY frequency DESC '
cur.execute(sql)

frequenchy = []
for row in cur.fetchall():
    frequenchy.append(row[0])

# print(frequenchy[0])

g = geocoder.google(address)
geocoded = '' + str(g.lat) + ','+ str(g.lng)
print("dgdfgdfgdfgdfgdfg")
url = 'https://maps.googleapis.com/maps/api/place/textsearch/json'
params = {'language':'en', 'location=' : geocoded, 'query':frequenchy[0], 'radius':'30', 'key':'AIzaSyAe-_fUznUY7EH9JMJ-SAsstofiMcb0qRE'}
print(params)
r = requests.get(url, params=params)
print(r)
results = r.json()['results']
# print(results)

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
