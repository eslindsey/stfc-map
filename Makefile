.PHONY: all
all: public-html/geo.json
	sudo docker-compose up --build -d

public-html/geo.json: builder/geojson builder/nodes.json builder/systems.json
	cd builder && ./geojson >../public-html/geo.json

