#!/bin/bash
#
#


cd /home/erapetti/Pases
export NODE_ENV=production
#export LOG_QUERIES=true
exec sails lift --prod
