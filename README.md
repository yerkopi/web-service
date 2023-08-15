# web
ii-co web

# overall structure
rendering is done by the client since server is not powerful enough to do it (and it's not necessary)
server is only responsible for serving static files and providing API endpoints for the client to fetch data from the git
auto deployment is done by the server, which will pull the latest changes from the git and restart the server
