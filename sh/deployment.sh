cd /home/ubuntu/ed-fusion/api
echo "Installing dependencies"
npm install

echo "Running migrations"
node ace migration:run --force

echo "Restarting Services"
