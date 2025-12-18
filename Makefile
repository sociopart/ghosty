PHONY: *

getdocker: ; sudo curl -fsSL get.docker.com | sh
start:     ; docker compose up --build
stop:      ; docker compose stop
clean:     ; docker compose down --rmi all -v --remove-orphans