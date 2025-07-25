import pandas as pd
import json

df = pd.read_excel("population raw data.xlsx")

cities = []

for _, row in df.iterrows():
    city = row.iloc[0]
    population_list = []
    for year in df.columns[1:]:
        population_list.append({
            "year": int(year),
            "population": int(row[year])
        })
    cities.append({
        "city": city,
        "population": population_list
    })

result = {"cities": cities}

with open("population.json", "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)
