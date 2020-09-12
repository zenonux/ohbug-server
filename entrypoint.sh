#!/bin/bash

yarn start:prod & nginx -g 'daemon off;'
