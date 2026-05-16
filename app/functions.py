def passwordsMatch(password, confirmPassword):
    return password == confirmPassword

def isValidEmail(email):
    return "@" in email and "." in email.split("@")[-1]

def checkCreds(storedPW, inputPw):
    return storedPW == inputPw

def canAccessSession(userID, sessionUserID):
    return userID == sessionUserID

def updateProgress(curProgress, increment):
    newValue = curProgress + increment
    return min(newValue, 100)
