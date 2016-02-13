import sys

import sys, json

# simple JSON echo script
# print "happened"
msg = ""
for line in sys.stdin:
  msg = msg + line[:-1]


d = json.loads(msg)
print(d["0"]["0"])
