CONST_ZEROES = "00000"

import hashlib
import sys

def getDigest(doorID, num):
  m = hashlib.md5()
  m.update(doorID + str(num))
  return m.hexdigest();
  
def getPassword(doorID):
  password = [""] * 8
  num = 0
  allDone = False
  while(allDone == False):
    digest = getDigest(doorID, num)
    num += 1
    if(digest[0:5] == CONST_ZEROES):
      if(digest[5:6].isdigit()):
        idx = int(digest[5:6])
        if(idx >= 0 and idx < len(password) and password[idx] == ""):
          password[idx] = digest[6:7]
          allDone = "" not in password
      
  
  return "".join(password)
  
#print getPassword('abc')
print getPassword('uqwqemis')