#!/bin/bash
format=f
while getopts ":t:f:" option; do
   case $option in
      t)
         export TZ=$OPTARG;;
      f)
         format=$OPTARG;;
      \?)
          echo "Error: invalid option"
          exit;;
   esac
done
shift $((OPTIND-1))
unset OPTIND
date=$1
string="<t:$(date --date="${date}" +%s):${format}>"
if [ $? = "0" ]
  then
    echo "${string}"
  else
    exit 1
fi
