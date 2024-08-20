import random
import math

from galaxy import *
from star import *
from helperfuncs import *

STARGRIDSIZE = 0.25
STARGRIDJITTER = 0.25 - (0.25/4)

def centerGalaxy(galaxy):
    min_x, min_y, max_x, max_y = float("inf"), float("inf"), 0, 0
    for star in galaxy.stars:
        if (star.x < min_x): min_x = star.x
        if (star.y < min_y): min_y = star.y
        if (star.x > max_x): max_x = star.x
        if (star.y > max_y): max_y = star.y

    mid_x = (min_x + max_x) / 2
    mid_y = (min_y + max_y) / 2

    dif_x = random.randint(0,4) - 2 - mid_x
    dif_y = random.randint(0,4) - 2 - mid_y

    for star in galaxy.stars:
        star.x += dif_x
        star.y += dif_y

    for fleet in galaxy.fleets:
        fleet.x += dif_x
        fleet.y += dif_y

def setResources(star, level):
    # Set resources
    # Level: Standard / plentiful / scarce natural resources
    p0x = 1
    p1x = 1 if level == 1 else 12.5 if level == 2 else 25
    p2x = 50
    t = random.random()
    u = 1 - t
    star.setResources = round(p0x * u * u + p1x * 2 * u * t + p2x * t * t)
        

def createHomeStarPointsCircle(distance, players):
    homeStarPoints = []
    circumradius = (distance / 2) / (2 * math.sin(math.pi / len(players)))
    for playerNumber in range(len(players)):
        sx = math.sin(2 * math.pi * playerNumber / len(players)) * circumradius
        sy = math.cos(2 * math.pi * playerNumber / len(players)) * circumradius
        homeStarPoints.append(Point(sx, sy))
    return homeStarPoints

def addPointToGrid(starGrid, point):
    x = round(point.x / STARGRIDSIZE) * STARGRIDSIZE
    y = round(point.y / STARGRIDSIZE) * STARGRIDSIZE
    pos = Point(x, y)
    if pos.x in starGrid:
        if pos.y in starGrid[pos.x]:
            starGrid[pos.x][pos.y] += 1
            return False
        else:
            starGrid[pos.x][pos.y] = 1
    else:
        starGrid[pos.x] = dict()
        starGrid[pos.x][pos.y] = 1
    return pos

def createNameList(config):
    names = []
    namesRequired = (config["starsPerPlayer"] + 1) * (config["players"] + 1)
    if config["mirror"]: namesRequired += 16
    while len(names) < namesRequired:
        newName = random.choice(preplacenames) + " " + random.choice(starnames)
        if newName in names:
            continue
        names.append(newName)

    random.shuffle(names)
    return names

def createPlayerStarsRandomSplatter(galaxy, hs, hsd, spp, kind, ss, starGrid):
    playerStars = []
    circumradius = hsd / 2 / (2 * math.sin(math.pi / len(galaxy.players)))
    angles = [_ for _ in range(0,720,5)]
    random.shuffle(angles)
    distanceStep = (hsd + 1) / 2 / spp
    distances = [_ for _ in range(0.125, distanceStep * spp * 5, distanceStep * 1)]
    fromCenter = False

    i = 0
    while len(playerStars) < spp - 1:
        i += 1
        if (i > len(distances)):
            break
        
        if kind != "circular":
            fromCenter = False

        if len(playerStars) < ss:
            fromCenter = False

        throwAngle = random.choice(angles) * math.pi / 180

        if fromCenter:
            d = random.random() * circumradius * 2
            pos = Point(d*math.cos(throwAngle), d*math.sin(throwAngle))
            fromCenter = False
        else:
            d = distances[i]
            pos = Point(hs.x + d*math.cos(throwAngle), hs.y + d*math.sin(throwAngle))
            fromCenter = True
        
        gridded = addPointToGrid(starGrid, pos)
        if gridded != False:
            pos = gridded
            playerStars.append(pos)
    return playerStars



def create(galaxy, config):
    galaxy.stars = []
    names = createNameList(config)
    players = galaxy.players

    homeStarPoints = []
    if config.starfield == "circular":
        homeStarPoints = createHomeStarPointsCircle(config["homeStarDistance"], players)
    random.shuffle(homeStarPoints)

    nameIndex = 0
    homeStars = []

    starGrid = dict()
    
    for player in players:
        newStar = galaxy.createStar(names[nameIndex], homeStarPoints[nameIndex].x, homeStarPoints[nameIndex].y, player, 50, config["startEcon"], config["startInd"], config["startSci"], config["startShips"])
        homeStars.append(newStar)
        nameIndex += 1
        
        gridded = addPointToGrid(starGrid, newStar)
        newStar.x = gridded.x
        newStar.y = gridded.y

    mirrorRelations = []
    ssp = config["starsPerPlayer"]
    if config["mirror"]:
        ssp = round(ssp/2)
        
    for hs in homeStars:
        points = createPlayerStarsRandomSplatter(galaxy, hs, config["homeStarDistance"], ssp, config["starfield"], config["startStars"] + 1, starGrid)

        for point in points:
            n = names[nameIndex]
            newStar = galaxy.createStar(n, point.x, point.y, None, 0, 0, 0, 0, 0)
            setResources(newStar, config["naturalResources"], (point.x**2 + point.y**2)**(1/2))

            if config["mirror"]:
                gridded = addPointToGrid(starGrid, Point(-point.x, -point.y))
                if gridded != False:
                    n = newStar.name.reverse()
                    mirrorStar = galaxy.createStar(n, gridded.x, gridded.y, None, 0, 0, 0, 0, 0)
                    mirrorStar.setResources(newStar.resources)
    





global preplacenames
preplacenames = [
	"Hard",
	"Dull",
	"Lush",
	"Dry",
	"Wet",
	"Soft",
	"Hot",
	"Cold",
	"Slow",
	"Fast",
	"Pure",
	"Blue",
	"Red",
	"Black",
	"White",
	"Lost",
	"Fort",
	"Free",
	"Bright",
	"Dark",
	"Grand",
	"Last",
	"Mega",
	"New",
	"Nova",
	"Odd",
	"Old",
	"Port",
	"Wild",
	"Young",
	"Alpha",
	"Beta",
	"Gamma",
	"Delta",
	"Zeta",
	"Eta",
	"Theta",
	"Kappa",
	"Mu",
	"Nu",
	"Xi",
	"Pi",
	"Sigma",
	"Tau",
]

global starnames
starnames = [
	"Ale",
	"Arc",
	"Ash",
	"Bam",
	"Chi",
	"Cox",
	"Duo",
	"Dux",
	"Elk",
	"Fax",
	"Fad",
	"Fay",
	"Fez",
	"Fin",
	"Foe",
	"Git",
	"Goo",
	"Gut",
	"Hag",
	"Ill",
	"Ice",
	"Ick",
	"Imp",
	"Ion",
	"Ire",
	"Irk",
	"Jaw",
	"Jib",
	"Keg",
	"Koi",
	"Kit",
	"Kat",
	"Mac",
	"Mix",
	"Mog",
	"Mud",
	"Neo",
	"Nog",
	"Pan",
	"Paw",
	"Pax",
	"Pee",
	"Pug",
	"Quo",
	"Rad",
	"Ram",
	"Rat",
	"Raw",
	"Rub",
	"Rye",
	"Saw",
	"Shy",
	"Sky",
	"Spy",
	"Sun",
	"Tab",
	"Tack",
	"Tag",
	"Tax",
	"Tic",
	"Toe",
	"Ugh",
	"Urn",
	"Wow",
	"Yak",
	"Yay",
	"Yum",
	"Zit",
	"Zoo",
	"Acamar",
	"Achernar",
	"Achird",
	"Acrab",
	"Acrux",
	"Acubens",
	"Adhafera",
	"Adhara",
	"Ain",
	"Aladfar",
	"Alamak",
	"Alathfar",
	"Alaraph",
	"Albaldah",
	"Albali",
	"Albireo",
	"Alchiba",
	"Alcor",
	"Alcyone",
	"Aldebaran",
	"Alderamin",
	"Aldhafera",
	"Aldhanab",
	"Aldhibah",
	"Aldib",
	"Fawaris",
	"Alfecca",
	"Alfirk",
	"Algedi",
	"AlGiedi",
	"Algenib",
	"Algieba",
	"Algol",
	"Algorab",
	"Alhajoth",
	"Alhena",
	"Alioth",
	"Alkaid",
	"AlKurud",
	"Alkalurops",
	"AlKap",
	"Alkes",
	"Alkurah",
	"Almach",
	"AlNair",
	"Alnasl",
	"Alnilam",
	"Alnitak",
	"Alniyat",
	"Alpha",
	"Alphard",
	"Alphecca",
	"Alpheratz",
	"Alrai",
	"Alrakis",
	"Alrami",
	"Alrischa",
	"Alsafi",
	"Alshain",
	"Alshat",
	"Altair",
	"Altais",
	"Altarf",
	"Aludra",
	"Alula",
	"Alwaid",
	"Alya",
	"Alzir",
	"Ancha",
	"Angetenar",
	"Ankaa",
	"Antares",
	"Ant",
	"Arc",
	"Arcturus",
	"Arich",
	"Arided",
	"Arkab",
	"Arneb",
	"Arrakis",
	"Ascella",
	"Asellus",
	"Ash",
	"Ashlesha",
	"Askella",
	"Asp",
	"Asterion",
	"Asterope",
	"Atik",
	"Atlas",
	"Atria",
	"Auva",
	"Avior",
	"Azaleh",
	"Azel",
	"Azha",
	"Azimech",
	"Azmidiske",
	"Baham",
	"Baten",
	"Becrux",
	"Beid",
	"Bellatrix",
	"Benetnasch",
	"Betelgeuse",
	"Betria",
	"Bharani",
	"Biham",
	"Birdun",
	"Botein",
	"Brachium",
	"Bunda",
	"Canopus",
	"Capella",
	"Caph",
	"Castor",
	"Cebalrai",
	"Celaeno",
	"Chara",
	"Cheleb",
	"Chertan",
	"Chort",
	"Chow",
	"Cor",
	"Cursa",
	"Corvid",
	"Dabih",
	"Decrux",
	"Deneb",
	"Denebola",
	"Dheneb",
	"Diadem",
	"Diphda",
	"Dnoces",
	"Dschubba",
	"Dubhe",
	"Duhr",
	"Edasich",
	"Electra",
	"Elm",
	"Elnath",
	"Eltanin",
	"Enif",
	"Errai",
	"Etamin",
	"Fomalhaut",
	"Samakah",
	"Furud",
	"Gacrux",
	"Garnet",
	"Gatria",
	"Gianfar",
	"Giedi",
	"Gienah",
	"Giennah",
	"Girtab",
	"Gomeisa",
	"Gor",
	"Grafias",
	"Grassias",
	"Grumium",
	"Hadar",
	"Hadir",
	"Haedus",
	"Haldus",
	"Hamal",
	"Hassaleh",
	"Heka",
	"Heze",
	"Hoedus",
	"Homam",
	"Hyadum",
	"Hydrus",
	"Hydrobius",
	"Izar",
	"Jabbah",
	"Jih",
	"Juxta",
	"Kaf",
	"Kajam",
	"Kastra",
	"Kaus",
	"Keid",
	"Kita",
	"Kleeia",
	"Kochab",
	"Korn",
	"Kraz",
	"Ksora",
	"Kullat",
	"Kuma",
	"Lanx",
	"Lesath",
	"Lucida",
	"Maasym",
	"Mahasim",
	"Maia",
	"Marfark",
	"Marfik",
	"Markab",
	"Matar",
	"Mebsuta",
	"Media",
	"Megrez",
	"Meissa",
	"Mekbuda",
	"Menchib",
	"Menkab",
	"Menkalinan",
	"Menkar",
	"Menkent",
	"Menkib",
	"Merak",
	"Merga",
	"Merope",
	"Mesarthim",
	"Mi",
	"Mimosa",
	"Minchir",
	"Minelava",
	"Minkar",
	"Mintaka",
	"Mira",
	"Mirach",
	"Miram",
	"Mirfak",
	"Mirzam",
	"Misam",
	"Mizar",
	"Mothallah",
	"Muliphein",
	"Muphrid",
	"Murzim",
	"Muscida",
	"Naos",
	"Nash",
	"Nashira",
	"Navi",
	"Nekkar",
	"Neshmet",
	"Nihal",
	"Nunki",
	"Nusakan",
	"Okul",
	"Pax",
	"Peacock",
	"Phact",
	"Phad",
	"Pherkad",
	"Pherkard",
	"Pleione",
	"Polaris",
	"Pollux",
	"Porrima",
	"Praecipua",
	"Procyon",
	"Propus",
	"Proxima",
	"Pux",
	"Rana",
	"Rasalas",
	"Rastaban",
	"Ras",
	"Regor",
	"Regulus",
	"Rigel",
	"Rigil",
	"Ri",
	"Rotanev",
	"Ruchba",
	"Ruchbah",
	"Rukbat",
	"Rukh",
	"Sabik",
	"Sadachbia",
	"Sadalbari",
	"Sadalmelik",
	"Sadalsuud",
	"Sadatoni",
	"Sadira",
	"Sadr",
	"Saiph",
	"Salm",
	"Sargas",
	"Sarin",
	"Sarir",
	"Sasin",
	"Sceptrum",
	"Scheat",
	"Scheddi",
	"Schedir",
	"Segin",
	"Seginus",
	"Sham",
	"Shaula",
	"Sheliak",
	"Sheratan",
	"Sirius",
	"Situla",
	"Skore",
	"Spica",
	"SteropeII",
	"Sualocin",
	"Subra",
	"Suhail",
	"Sulafat",
	"Syrma",
	"Tabit",
	"Talitha",
	"Tania",
	"Tarazet",
	"Taygeta",
	"Tegmen",
	"Terebellum",
	"Tejat",
	"Thabit",
	"Theemin",
	"Thuban",
	"TienKuan",
	"Toliman",
	"Tor",
	"Septen",
	"TseenKee",
	"Tureis",
	"Tyl",
	"Unuk",
	"Vega",
	"Vindemiatrix",
	"Wasat",
	"Wazn",
	"Wei",
	"Wezen",
	"Yed",
	"Yildun",
	"Zaniah",
	"Zaurak",
	"Zavijava",
	"Zosma",
	"Zuben",
	"Zug",
	"Zu",
]

