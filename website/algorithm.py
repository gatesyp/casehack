import MySQLdb, json, sys
from collections import Counter

my_dict = []

# simple JSON echo script
# print "happened"
# msg = ""
# for line in sys.stdin:
#   msg = msg + line[:-1]


# d = json.loads(msg)
d = {u'1': {u'1': u'Restaurants', u'0': u'Food and Drink', u'2': u'Coffee Shop'}, u'0': {u'1': u'Computers and Electronics', u'0': u'Shops'}, u'3': {u'1': u'Restaurants', u'0': u'Food and Drink', u'2': u'Coffee Shop'}, u'2': {u'1': u'Restaurants', u'0': u'Food and Drink', u'2': u'Coffee Shop'}, u'5': {}, u'4': {u'1': u'Restaurants', u'0': u'Food and Drink', u'2': u'Pizza'}};

for key, value in d.iteritems():
    my_key = frozenset(d[key].items())
    for a_key, a_value in my_key:
        my_dict.append(a_value)
frequency_list = (Counter(my_dict).most_common())

for key, elem in frequency_list:
    print(key)
    print(elem)





# print(frequency_list[0][0])
