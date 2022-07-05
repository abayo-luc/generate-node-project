result=${PWD##*/}          # to assign to a variable
result=${result:-/}        # to correct for the case where PWD=/

docker build -t $result . && \
docker run -dp 3000:3000 $result