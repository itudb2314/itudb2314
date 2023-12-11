from db.db import db
from api import server


def main():
    database = db('fifa')
    app = server.create_server(database)
    app.run(host="0.0.0.0", debug=True)

if __name__ == "__main__":
    main()
