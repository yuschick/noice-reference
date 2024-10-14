#!/bin/bash

echo "Thanks for flying with the temporary ffmpeg convert script!"
echo "Someone please migrate me to a better implementation, ty :)"

echo "Converting wav -> webm"
for i in *.wav; do ffmpeg -i "$i" "${i%.*}.webm"; done

echo "Converting wav -> mp3"
for i in *.wav; do ffmpeg -i "$i" "${i%.*}.mp3"; done