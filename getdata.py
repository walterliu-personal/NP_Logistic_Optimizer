import json
import requests

ROOT = "https://np.ironhelmet.com/api?"

def read_galaxy_data(game_id, api_key):
    #params = {"game_number" : game_id, "api_version" : "0.1", "code" : api_key,}
    payload = requests.post(f"https://np4.ironhelmet.com/api?game_number={game_id}&api_version=0.1&code={api_key}")
    
if __name__ == "__main__":
    # Testing
    read_galaxy_data("1029", "31tQKWUOwndB")