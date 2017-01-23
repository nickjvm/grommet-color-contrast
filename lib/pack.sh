#! /bin/sh
mkdir -p hcoe-ui/dist hcoe-ui/server
cp -p package.json hcoe-ui/package.json
cp -Rp dist/* hcoe-ui/dist
cp -Rp server/* hcoe-ui/server
tar -czf hcoe-ui.tar.gz hcoe-ui
rm -rf hcoe-ui

echo "Created hcoe-ui.tar.gz..."
