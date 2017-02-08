var MOCK_USER_DATA = {
	"users": [
        {
            "firstName": "John",
            "lastName": "Smith",
            "email": "something@nowhere.com",
            "address": "1 Home St.",
            "city": "Boston",
            "state": "MA",
            "zip": "12345",
            "phone": "555-555-5555",
            "position": "Retail Sales Specialist",
            "password": "password"
            "stores": [
                {
                    "name": "A Store Name",
                    "id": "1234567890",
                    "address": "1 Market St.",
                    "city": "Beantown",
                    "state": "MA",
                    "generalComments": "store wants paperwork back",
                    //user can add multiple contacts
                    "person": [
                        {
                            "name": "Jill White",
                            "position": "manager",
                            "comment": "has a son named brian."
                        },
                        {
                            "name": "Chaz Bono",
                            "position": "accountant",
                            "comment": "only works 10-2pm"
                        }
                    ],
                    "tier": "gold",
                    "havePaperwork": true,
                    "wantPaperworkBack": true,
                    "lastRedeemed": "12/12/16" 
                    //use function to also display quarter
                }
            ]
        }
    ]
};