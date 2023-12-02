from db.db import db
from api import server


def main():
    database = db('fifa')
    app = server.create_server(database)
    app.run(debug=True)

if __name__ == "__main__":
    main()
