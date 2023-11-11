from db.db import db
from api import server
from db.models.Player import *

def main():
    database = db('fifa')
    app = server.create_server(database)
    app.run()

if __name__ == "__main__":
    main()
