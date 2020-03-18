LINKERFLAGS = -X main.Version=`git describe --tags --always --long --dirty` -X main.BuildTimestamp=`date -u '+%Y-%m-%d_%I:%M:%S_UTC'`

VERSION := $(if $(DRONE_TAG),$(DRONE_TAG),master)
BINARY_NAME := $(if $(DRONE_REPO_NAME),$(DRONE_REPO_NAME),main)

test:
	go test ./... -cover -coverprofile=coverage.txt

build-alpine:
	GOOS=linux GOARCH=amd64 pkger
	GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -a -o $(BINARY_NAME)-$(VERSION)-alpine -ldflags "$(LINKERFLAGS)"
	rm pkged.go

