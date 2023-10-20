from db import db

def main():
    database = db.db('fifa')
    database.connect()
    database.disconnect()

if __name__ == "__main__":
    main()
