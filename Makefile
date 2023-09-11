.PHONY: all
all:
	@echo This Makefile requires a specific target. The most common options are:
	@echo usage: make [testing]

.PHONY: testing
testing: public-html/geo.json
	sudo docker-compose up --build -d

.PHONY: release
release:
	curl "https://api.spocks.club/translations/en/factions" >builder/loca/factions.json
	curl "https://assets.stfc.space/data/latest/translations/en/systems.json" >builder/loca/systems.json
	make public-html/geo.json

public-html/geo.json: builder/geojson builder/galaxy_nodes_optimised.json builder/loca/systems.json builder/loca/factions.json builder/loca/resources.json builder/loca/mission_titles.json
	cd builder && ./geojson >../public-html/geo.json

