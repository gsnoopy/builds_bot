
import requests
from bs4 import BeautifulSoup

url = 'https://u.gg/lol/champions/zac/build/jungle?rank=overall'
response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')

# Runas

links_imagens_runas = set()
active_subdivs = soup.find_all('div', class_='perk perk-active')
for active_subdiv in active_subdivs:
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
