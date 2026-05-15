def passwordsMatch(password, confirmPassword):
    return password == confirmPassword

def isValidEmail(email):
    return "@" in email and "." in email.split("@"[-1])