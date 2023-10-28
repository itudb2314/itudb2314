from db.db import db

def main():
    database = db('fifa')
    database.connect()    
    database.disconnect()

if __name__ == "__main__":
    main()
