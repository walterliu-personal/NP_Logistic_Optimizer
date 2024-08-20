ECON_BASE = 500
IND_BASE = 1000
SCI_BASE = 4000
WARP_BASE = 10000

class Star:

    def __init__(self, x, y, resources, name, uid):
        print("This is a fake star")
        self.ships = 0
        self.econ = 0
        self.ind = 0
        self.sci = 0
        self.fleets_at_star = []
        self.x = x
        self.y = y
        self.resources = resources
        self.name = name
        self.owner = None
        self.uid = uid
        self.haswarp = False
        self.owner = None

    def setOwner(self, player):
        self.owner = player

    def setResources(self, resources):
        self.resources = resources

    def setShips(self , nships):
        self.ships = nships

    def setEcon(self, econ):
        self.econ = econ

    def setInd(self, ind):
        self.ind = ind

    def setSci(self, sci):
        self.sci = sci

    def calcEconPrice(self):
        return (self.econ+1)*ECON_BASE / self.resources
    
    def calcIndPrice(self):
        return (self.ind+1)*IND_BASE / self.resources
    
    def calcSciPrice(self):
        return (self.sci+1)*SCI_BASE / self.resources
    
    def calcWarpPrice(self):
        return WARP_BASE / self.resources