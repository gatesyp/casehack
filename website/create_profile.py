import MySQLdb, json, sys
from collections import Counter
db = MySQLdb.connect(host="localhost",    # your host, usually localhost
                     user="root",         # your username
                     passwd="root",  # your password
                     db="casehack")
cur = db.cursor()

# Use all the SQL you like

# print all the first cell of all the rows

my_dict = []

# simple JSON echo script
print "happened"
msg = ""
for line in sys.stdin:
  msg = msg + line[:-1]

# print(msg)
d = json.loads(msg)
identifier = d["id"]
for key, value in d.items():
    if key == "id":
        del d["id"]
# print(d)
# print(identifier)

# d = {u'1': {u'1': u'Restaurants', u'0': u'Food and Drink', u'2': u'Coffee Shop'}, u'0': {u'1': u'Computers and Electronics', u'0': u'Shops'}, u'3': {u'1': u'Restaurants', u'0': u'Food and Drink', u'2': u'Coffee Shop'}, u'2': {u'1': u'Restaurants', u'0': u'Food and Drink', u'2': u'Coffee Shop'}, u'5': {}, u'4': {u'1': u'Restaurants', u'0': u'Food and Drink', u'2': u'Pizza'}};
# identifier = "hgsddydollzxc"


for key, value in d.iteritems():
    my_key = frozenset(d[key].items())
    for a_key, a_value in my_key:
        my_dict.append(a_value)
frequency_list = (Counter(my_dict).most_common())
# ---------------Check to see if the user is registered. If not, register them
sql = 'SELECT EXISTS(SELECT 1 FROM registered_users WHERE identity = \"' + identifier+ '\")'
cur.execute(sql)
for row in cur.fetchall():
    result = row[0]
if result == 0:
    # register them
    cur.execute('INSERT INTO registered_users(identity) VALUES (\"' + identifier + '\")')
    db.commit()
    # print("they ARE registered")


# ---------------Find the id for registered user.
sql = 'SELECT id FROM registered_users WHERE identity = \'' + identifier + '\''
# print(sql)
cur.execute(sql)
for row in cur.fetchall():
    identifier = row[0]

# # ---------------Add in all of their values
for key, elem in frequency_list:
    sql = 'INSERT INTO user_profiles (profile_id, category, frequency) VALUES (' + str(identifier) + ', \'' + str(key) + '\', ' + str(elem) + ') ON DUPLICATE KEY UPDATE frequency = ' + str(elem)
    print(sql)
    cur.execute(sql)
    # cur.execute('''INSERT INTO user_profiles(profile_id, category, frequency) VALUES (%s, %s, %s)''', (identifier, key, elem))
    # print(key)
    # print(elem)
    db.commit()
print("success")
db.close()
