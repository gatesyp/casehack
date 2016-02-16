import json
import MySQLdb
import geocoder
import requests
import sys
from math import sin, cos, sqrt, atan2, radians
db = MySQLdb.connect(host="geohunt.c8tiwzwpchl4.us-east-1.rds.amazonaws.com",    # your host, usually localhost
                     user="root",         # your username
                     passwd="rGn3MDgfCqExqUF3",  # your password
                     db="geohunt")

cur = db.cursor()
#print( "happened")

msg = ""
for line in sys.stdin:
  msg = msg + line[:-1]

# print(msg)
message = json.loads(msg)
identifier = message["profID"]
#print(identifier)
#print(address)

# now I have the address and their profile ID
# build a 'value' profile for this address
# must look at what this person values
# ------------------------------------------------------------------
# get the profiles PK
sql = 'SELECT id FROM registered_users WHERE identity = \"' + identifier+ '\"'
cur.execute(sql)
for row in cur.fetchall():
    pk = row[0]
print(pk)
# now I have their pk
# get their most frequent words from transactions
sql = 'SELECT category FROM user_profiles WHERE profile_id =' + str(pk) + ' ORDER BY frequency DESC '
cur.execute(sql)

frequenchy = []
for row in cur.fetchall():
    frequenchy.append(row[0])

#hi =  json.loads(frequenchy)
#print(frequenchy)


