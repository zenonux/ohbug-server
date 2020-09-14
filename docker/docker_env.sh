#!/bin/bash

export DOCKER_HOST_IP=$(ip route get 1 | awk '{print $(NF-2);exit}')
