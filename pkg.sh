SQLITEVERSION=$(npm show sqlite3 version)
NAPI=$(node -e "console.log(process.versions.modules)")
NVERSION=$(node -e "console.log(process.versions.node)" | cut -d. -f1)

# Build app
echo "Building app from flowtyped to strict javascript"
npm run build

# Remove old builds
echo "Removing old builds"
rm -r builds 2> /dev/null

# Create folders for completed builds
echo "Preparing folders"
mkdir -p builds/linux
mkdir builds/windows
mkdir builds/macos

# Build js files for 3 platforms
echo "Building exectuables from javascript"
./node_modules/.bin/pkg \
  -t "node$NVERSION-linux-x64,node$NVERSION-windows-x64,node$NVERSION-mac-x64" \
  --output builds/totify \
  package.json

# Move executables to separate folders
echo "Moving executables to separate folder"
mv builds/totify-linux builds/linux/totify
mv builds/totify-macos builds/macos/totify
mv builds/totify-win.exe builds/windows/totify

# Download correct version of sqlite prebuild grep
# rm -r tmp 2> /dev/null
echo "Creating tmp folders for cached download"
mkdir tmp 2> /dev/null
cd tmp

echo "Downloading missing sqlite's native dependencies"
if [ ! -e $NAPI-win32.tar.gz ]; then
echo "Downloading win32 sqlite"
curl "https://mapbox-node-binary.s3.amazonaws.com/sqlite3/v$SQLITEVERSION/node-v$NAPI-win32-x64.tar.gz" -o $NAPI-win32.tar.gz > /dev/null
fi

if [ ! -e $NAPI-linux.tar.gz ]; then
echo "Downloading linux sqlite"
curl "https://mapbox-node-binary.s3.amazonaws.com/sqlite3/v$SQLITEVERSION/node-v$NAPI-linux-x64.tar.gz" -o $NAPI-linux.tar.gz > /dev/null
fi

if [ ! -e $NAPI-mac.tar.gz ]; then
echo "Downloading mac sqlite"
curl "https://mapbox-node-binary.s3.amazonaws.com/sqlite3/v$SQLITEVERSION/node-v$NAPI-darwin-x64.tar.gz" -o $NAPI-mac.tar.gz > /dev/null
fi

echo "Extracting deps to separate folders"
for name in *.tar.gz
do
  OP=$(echo $name | cut -d. -f1)
  tar -xOf $name > "$OP-node_sqlite3.node" 
done;

if [ -e $NAPI-mac-node_sqlite3.node ]; then
mv $NAPI-mac-node_sqlite3.node ../builds/macos/node_sqlite3.node
fi

if [ -e $NAPI-win32-node_sqlite3.node ]; then
mv $NAPI-win32-node_sqlite3.node ../builds/windows/node_sqlite3.node
fi

if [ -e $NAPI-linux-node_sqlite3.node ]; then
mv $NAPI-linux-node_sqlite3.node ../builds/linux/node_sqlite3.node
fi

cd ..

# pkg \
#   -t latest-linux-x64,latest-windows-x64,latest-mac-x64 \
#   --out-path builds \
#   --c pkg.json \
#   dst/index.js
