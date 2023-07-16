.PHONY: all
all: public-html/geo.json
	sudo docker-compose up --build -d

public-html/geo.json: builder/geojson builder/nodes.json builder/systems.loca.json builder/factions.loca.json builder/resources.loca.json
	cd builder && ./geojson >../public-html/geo.json

