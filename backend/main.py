from db import db

from db.models.squads import *
from db.models.player_apperances import *
from db.models.players import *

def main():
    database = db.db('fifa')
    database.connect()

    # test module fore squads
    # created_record = database.create_squad('WC-1930', 'T-07', 'P-33095', '1', 'Goalkeeper', 'GK')
    # if created_record:
    #     result = database.get_specific_squad('WC-1930', 'T-07', 'P-33095')
    #     result.print_squad()
    #     print()
    #     database.update_squad('WC-1930', 'T-07', 'P-33095', '10', 'striker', 'ST')
    #     result = database.get_specific_squad('WC-1930', 'T-07', 'P-33095')
    #     result.print_squad()
    #     print()
    #     database.delete_squad('WC-1930', 'T-07', 'P-33095')

    # database.disconnect()

if __name__ == "__main__":
    main()
