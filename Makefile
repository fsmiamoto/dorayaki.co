build:
	hugo

dev:
	hugo server --disableFastRender

deploy: build
	scp -r public/* dorayaki.co:/var/www/dorayaki.co

theme-update:
	git submodule update --remote themes/PaperMod


.PHONY: dev deploy build theme-update
