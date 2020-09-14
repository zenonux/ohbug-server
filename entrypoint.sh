#!/bin/bash

npm run start:prod & nginx -g 'daemon off;'
