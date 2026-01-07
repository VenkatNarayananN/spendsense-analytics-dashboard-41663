#!/bin/bash
cd /home/kavia/workspace/code-generation/spendsense-analytics-dashboard-41663/frontend_spendsense_dashboard
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

