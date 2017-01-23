#! /bin/sh
mkdir -p dist/docs
NexusIEVersion=$(git ls-remote --tags git@github.hpe.com:hcoe/ie.git | \
 awk '{print $2}' | \
 grep -v '{}' | \
 awk -F"/" '{print $3}' | \
 sort -t. -k 1,1n -k 2,2n -k 3,3n | \
 tail -n 1)

echo "\nDownloading IE docs:$NexusIEVersion from Nexus\n"
curl -u "5fhB/G4H:gAWD5bYUDioJaCbHZ4p12zcCKvP75QWkMQ85W4Dx3HD+" -O https://nexus-int.austin.hpecorp.net/nexus/content/repositories/HPINT-release1-M2/com/hpe/hcoe/ie/$NexusIEVersion/hcoe-ie.tar.gz

tar -xzf hcoe-ie.tar.gz -C dist/docs
rm -f hcoe-ie.tar.gz
