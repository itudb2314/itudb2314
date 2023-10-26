from db import db

def main():
    database = db.db('fifa')
    database.connect()
    results = database.get_squad('WC-1930')
    for result in results:
        print(result.tournament_id)
    database.disconnect()

if __name__ == "__main__":
    main()
