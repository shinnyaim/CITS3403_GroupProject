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

def calculate_rank(best_score):
    """
    Calculate rank based on best run score.
    Returns a rank title based on overall performance.
    """
    if best_score is None or best_score == 0:
        return 'Novice'
    elif best_score >= 95:
        return 'Project Master'
    elif best_score >= 90:
        return 'Deadline Victor'
    elif best_score >= 80:
        return 'Team Player'
    elif best_score >= 70:
        return 'Competent Manager'
    elif best_score >= 60:
        return 'Deadline Dodger'
    else:
        return 'Barely Made It'
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