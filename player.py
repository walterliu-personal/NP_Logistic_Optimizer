class Player:

    def __init__(self, username, uid):
        self.username = username
        self.uid = uid
        self.stars = []

    def addStar(self, star):
        self.stars.append(star)