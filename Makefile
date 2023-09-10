.PHONY: all
all: public-html/geo.json
	sudo docker-compose up --build -d

public-html/geo.json: builder/geojson builder/galaxy_nodes_optimised.json builder/loca/systems.json builder/loca/factions.json builder/loca/resources.json builder/loca/mission_titles.json
	cd builder && ./geojson >../public-html/geo.json

