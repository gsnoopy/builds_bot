import requests
from bs4 import BeautifulSoup

url = 'https://u.gg/lol/champions/zac/build/jungle?rank=overall'
response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')

# Runas

links_imagens_runas = set()
active_subdivs1 = soup.find_all('div', class_='perk perk-active')
active_subdivs2 = soup.find_all('div', class_='perk keystone perk-active')

for active_subdiv in active_subdivs1:
    imagens = active_subdiv.find_all('img')
    
    for img in imagens:
        links_imagens_runas.add(img['src'])
        
for active_subdiv in active_subdivs2:
    imagens = active_subdiv.find_all('img')
    
    for img in imagens:
        links_imagens_runas.add(img['src'])
 

runas = set()
for link in links_imagens_runas:
    partes = link.split('/')
    parte_interesse = partes[-1].split('.')[0]
    runas.add(parte_interesse)

print("Runas:")
print(runas)

# Stats

shards_data = []

shard_active_divs = soup.find_all('div', class_='shard shard-active')
for shard_active_div in shard_active_divs:
    shard_image = shard_active_div.find('img')
    shard_name = shard_image['alt']
    shards_data.append(shard_name)

shards_data = shards_data[:-3]

print("Stats:")
print(shards_data)

# Summoner Spells

links_imagens_spells = set()
imagens = soup.find_all('img')
for img in imagens:
    if 'spell' in img['src'] and 'Summoner' in img['src']:
        links_imagens_spells.add(img['src'])

spells = set()
for link in links_imagens_spells:
    partes = link.split('/')
    parte_interesse = partes[-1].split('.')[0]
    spells.add(parte_interesse)  
    
print("Spells:")
print(spells)


# Skill Order

skills = []
div_skill_priority_path = soup.find('div', class_='skill-priority-path')
if div_skill_priority_path:
    
    divs_skill_label = div_skill_priority_path.find_all('div', class_='skill-label bottom-center')

    for div in divs_skill_label:
        skills.append(div.text.strip())
        
print("Skill Order:")
print(skills)

# Counters

counters = []
div_matchups_toughest = soup.find('div', class_='matchups', id='toughest-matchups')

if div_matchups_toughest:
    subdivs_champion_name = div_matchups_toughest.find_all('div', class_='champion-name')
    
    
for subdiv in subdivs_champion_name:
    counters.append(subdiv.text.strip())
    

print("Counters:")
print(counters)

# Build

url = 'https://probuildstats.com/champion/zac?role=jungle'
response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')

items_data = []

items = soup.find_all('div', class_='item')

for item in items:
    item_name = item.find('img')['alt']
    if not item_name.startswith('Summoner'):
        pick_rate = int(item.find('div', class_='pick-rate').get_text(strip=True).replace('%', ''))
        if pick_rate >= 15:
            item_data = {
                'item': item_name,
                'pick': f"{pick_rate}%"
            }
            items_data.append(item_data)

print("Items:")
print(items_data)