CONST_ZEROES = "00000"

import hashlib
import sys

def getDigest(doorID, num):
  m = hashlib.md5()
  m.update(doorID + str(num))
  return m.hexdigest();
  
def getPassword(doorID):
  password = ""
  num = 0
  while(len(password) < 8):
    digest = getDigest(doorID, num)
    num += 1
    if(digest[0:5] == CONST_ZEROES):
      password += digest[5:6]
  
  return password
  
#print getPassword('abc')
print getPassword('uqwqemis')
