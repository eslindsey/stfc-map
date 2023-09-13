.PHONY: all
all: builder/loca/factions.json builder/loca/systems.json
	curl -o builder/loca/factions.json -z builder/loca/factions.json "https://api.spocks.club/translations/en/factions"
	curl -o builder/loca/systems.json  -z builder/loca/systems.json  "https://assets.stfc.space/data/latest/translations/en/systems.json"
	make public-html/geo.json
	git status

.PHONY: testing
testing: public-html/geo.json
	sudo docker-compose up --build -d

public-html/geo.json: builder/geojson builder/galaxy_nodes_optimised.json builder/loca/systems.json builder/loca/factions.json builder/loca/resources.json builder/loca/mission_titles.json
	cd builder && ./geojson >../public-html/geo.json

