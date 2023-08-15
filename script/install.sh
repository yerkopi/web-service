#!/bin/bash

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

source "$DIR/../.env"

systemctl disable "$SERVICE_NAME"
systemctl stop "$SERVICE_NAME"

cp -f "$SERVICE_DIR/$SERVICE_NAME" "/lib/systemd/system/$SERVICE_NAME"

systemctl daemon-reload
systemctl enable "$SERVICE_NAME"
systemctl start "$SERVICE_NAME"
