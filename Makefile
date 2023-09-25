start-env:
	$(info Make: Starting Tyk dashboard and dependecies)
	docker-compose --env-file .env -f ci/testing_env.yml up
start-env-images:
	$(info Make: Starting Tyk dashboard and dependecies with official images)
	docker-compose --env-file .env -f ci/testing_env_images.yml up
stop-env:
	$(info Make: Stopping Tyk dashboard and dependecies)
	docker-compose --env-file .env -f ci/testing_env.yml down -v --remove-orphans