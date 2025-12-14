.PHONY: all
all:
	make public-html/geo.json
	git status

.PHONY: update
update:
	~/evilbadgey/evilbadgey -c ~/evilbadgey/.test-049.json download -o builder/galaxy_nodes_optimised.json --header 'Content-Type:application/json' --header 'ACCEPT:application/json' /game_world/galaxy_nodes_optimised
	curl -o builder/loca/systems.json        -z builder/loca/systems.json        'https://data.stfc.space/translations/en/systems.json'
	curl -o builder/loca/factions.json       -z builder/loca/factions.json       'https://data.stfc.space/translations/en/factions.json'
#	builder/loca/resources.json
	curl -o builder/loca/mission_titles.json -z builder/loca/mission_titles.json 'https://data.stfc.space/translations/en/mission_titles.json'

.PHONY: testing
testing: public-html/geo.json
	docker-compose up --build -d

public-html/geo.json: builder/geojson builder/galaxy_nodes_optimised.json builder/loca/systems.json builder/loca/factions.json builder/loca/resources.json builder/loca/mission_titles.json
	cd builder && ./geojson >../public-html/geo.json

