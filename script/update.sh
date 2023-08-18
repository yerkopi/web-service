#!/bin/bash

systemctl daemon-reload
git pull
npm install -f
