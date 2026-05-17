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

def convert_score_to_grade(score):
    if score is None or score == 0:
        return 'N/A'
    elif score >= 90:
        return 'HD'
    elif score >= 80:
        return 'D'
    elif score >= 70:
        return 'C'
    elif score >= 60:
        return 'P'
    else:
        return 'F'