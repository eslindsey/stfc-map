.PHONY: all
all:
	make public-html/geo.json
	git status

.PHONY: update
update:
	~/evilbadgey/evilbadgey -c ~/evilbadgey/.test-049.json download -o builder/galaxy_nodes_optimised.json --header 'Content-Type:application/json' --header 'ACCEPT:application/json' /game_world/galaxy_nodes_optimised
#	TODO: hostile/summary.json contains an array of hostile IDs (for groups of systems?) and next to `systems` can be found `warp` and `warp_with_superhighway`
	curl -o builder/hostile_summary.json     -z builder/hostile_summary.json     'https://data.stfc.space/hostile/summary.json'
	curl -o builder/loca/systems.json        -z builder/loca/systems.json        'https://data.stfc.space/translations/en/systems.json'
	curl -o builder/loca/factions.json       -z builder/loca/factions.json       'https://data.stfc.space/translations/en/factions.json'
#	builder/loca/resources.json
	curl -o builder/loca/mission_titles.json -z builder/loca/mission_titles.json 'https://data.stfc.space/translations/en/mission_titles.json'
#	TODO: These are not implemented yet but contain information we are missing.
#		curl -o builder/loca/navigation.json     -z builder/loca/navigation.json     'https://data.stfc.space/translations/en/navigation.json'
#		- faction_tag ("FED")
#		- marauder_name ("Nausicaan Outlaw ({0})")
#		- marauder_name_only ("Federation Elite \u21ef")
#		- marauder_name_short ("Verin Gang Marauder")
#		- officer_name ("Klingon Scout ({0})")
#		curl -o builder/loca/materials.json      -z builder/loca/materials.json      'https://data.stfc.space/translations/en/materials.json'
#		- resource_name ("3\u2605 Raw Ore")
#		- resource_name_short ("RAW ORE")
#		- resource_description ("Found in 3\u2605 Ore mines in Romulan Space.\nRefine this to get 3\u2605 Refined Ore (used to upgrade 3\u2605 ships).")
#		NOTE: Looks like there are more hostile names ("Veteran Klingon Patrol", etc.) in officer_names.json.

.PHONY: testing
testing: public-html/geo.json
	docker run -dit --name stfc-map -p 8085:80 -v ./public-html:/usr/local/apache2/htdocs/map/ httpd:alpine

.PHONY: stop
stop:
	docker stop stfc-map
	docker rm stfc-map

.PHONY: logs
logs:
	docker logs stfc-map

public-html/geo.json: builder/geojson builder/galaxy_nodes_optimised.json builder/hostile_summary.json builder/loca/systems.json builder/loca/factions.json builder/loca/resources.json builder/loca/mission_titles.json
	cd builder && ./geojson >../public-html/geo.json

