dev:
	hugo server --disableFastRender

build:
	hugo

deploy: build
	scp -r public/* dorayaki.co:/var/www/dorayaki.co

theme-update:
	git submodule update --remote themes/PaperMod


.PHONY: dev deploy build theme-update
