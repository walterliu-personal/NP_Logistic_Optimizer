from star import *
from fleet import *

class Galaxy:

    def __init__(self, stars, fleets, players):
        print("This is a fake galaxy")
        self.stars = stars
        self.fleets = fleets
        self.players = players

    def createStar(self, name, posx, posy, player, resources, econ, ind, sci, ships):
        newStar = Star(posx, posy, resources, name, len(self.stars))
        newStar.setOwner(player)
        newStar.setEcon(econ)
        newStar.setInd(ind)
        newStar.setSci(sci)
        newStar.setShips(ships)
        self.stars.append(newStar)
        player.addStar(newStar)
        return newStar