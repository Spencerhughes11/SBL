from flask import Flask, request, jsonify, session
from flask_cors import CORS
import mysql.connector
from flask_mysqldb import MySQL


app = Flask(__name__)
app.secret_key = 'ea49kjad92kd023dnpq321'

CORS(app)


@app.route('/mlb', methods=['POST'])
def mlb():
    try:
        data = request.get_json() 
        query = data.get('query')

        if not query:
            return jsonify({'error': 'query name not provided'})
        
        connection = mysql.connector.connect(host='localhost', user='root', password='', database='447')

        if connection.is_connected():
            print('Connected successfully')
        else:
            print('Failed to connect')

        mycursor = connection.cursor(dictionary=True)

        mycursor.execute(f"{query}")

        columns = mycursor.column_names

        data = mycursor.fetchall()

    

        mycursor.close()
        connection.close()
        
        response = {
            'columns': columns,
            'data': data
        }

        return response

    except Exception as e:
        return jsonify({'error': str(e)})
    
""" ======================================== NBA ======================================== """

@app.route('/nba', methods=['POST'])
def nba():
    try:
        data = request.get_json()  
        print(data)
        table = data.get('table')
        cols = data.get('cols')
        team = data.get('team')
        if table == 'Players':
            position = data.get('position')
        elif table == 'Teams':
            year = int(data.get('year')) if data.get('year') != 'all' else data.get('year')
            playoffs = data.get('playoffs')
            print(type(year))
        else:
            return jsonify({'error': 'invalid table name'})

        
        connection = mysql.connector.connect(host='localhost', user='root', password='', database='447')

        if connection.is_connected():
            print('Connected successfully')
        else:
            print('Failed to connect')

        mycursor = connection.cursor(dictionary=True)
        if not cols:
            columns = "*"
        else:
            cols.insert(0, 'DISTINCT NAME')          # always include names
            cols = [f"`{col}`" if '%' in col or '+' in col else col for col in cols]
            columns = ', '.join(cols)
        if table == 'Players':
            if position == 'all' and team == 'ALL':
                query = f'SELECT {columns} FROM nbaplayers'
            elif position != 'all' and team == 'ALL':
                query = f'SELECT {columns} FROM nbaplayers WHERE POS = "{position}"'
            elif team != 'all' and position == 'all':
                query = f'SELECT {columns} FROM nbaplayers WHERE TEAM = "{team}"'
            else:
                query = f'SELECT {columns} FROM nbaplayers WHERE TEAM = "{team}" and POS = "{position}"'
        elif table == 'Teams':      # team table
            if year == 'all' and team == 'ALL' and playoffs == 'both':

                query = f'SELECT {columns} FROM nbateams'
            elif year != 'all' and team == 'ALL' and playoffs =='both':
                query = f'SELECT {columns} FROM nbateams WHERE season = {year}'
            elif team != 'ALL' and year == 'all' and playoffs == 'both':
                query = f'SELECT {columns} FROM nbateams WHERE TEAM = "{team}"'
            elif playoffs != 'both' and year == 'all' and team == 'ALL':

                query = f'SELECT {columns} FROM nbateams WHERE playoffs = "{playoffs}"'
            elif team != 'ALL' and year != 'all' and playoffs == 'both':
                query = f'SELECT {columns} FROM nbateams WHERE TEAM = "{team}" and season = {year}'
            elif playoffs != 'both' and year != 'all' and team == 'ALL':
                query = f'SELECT {columns} FROM nbateams WHERE playoffs = "{playoffs}" and season = {year}'
            elif playoffs != 'both' and year == 'all' and team != 'ALL':
                query = f'SELECT {columns} FROM nbateams WHERE playoffs = "{playoffs}" AND TEAM = "{team}"'
            else:
                query = f'SELECT {columns} FROM nbateams WHERE playoffs = "{playoffs}" and season = {year} AND TEAM = "{team}"'
                
        mycursor.execute(query)
        columns = mycursor.column_names

        data = mycursor.fetchall()

        mycursor.close()
        connection.close()
        
        response = {
            'columns': columns,
            'data': data,
            'message': f'Successfully returned query: {query}'
        }
        return response

    except Exception as e:
        return jsonify({'error': str(e)})
    
""" ======================================== LOGIN/SESSIONS ======================================== """
    
""" Authenticate users """
@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()  
        first = data.get('first')
        last = data.get('last')
        username = data.get('username')
        password = data.get('password')
        method = data.get('method')

        if not username or not password:
            return jsonify({'error': 'Username or password not provided'})

        connection = mysql.connector.connect(host='localhost', user='root', password='', database='447')

        if connection.is_connected():
            print('Connected successfully')
        else:
            print('Failed to connect')

        mycursor = connection.cursor(dictionary=True)

        if method == 'signup':
            # Check if user already exists
            mycursor.execute("SELECT * FROM users WHERE username = %s", (username,))
            user_exists = mycursor.fetchone()
            
            if user_exists:
                return jsonify({'error': 'Account with username already exists'})
            
            mycursor.execute(
                "INSERT INTO users (first, last, username, password) VALUES (%s, %s, %s, %s)",
                (first, last, username, password)
            )
            connection.commit()  
            
        else:
            mycursor.execute('SELECT * FROM users WHERE username = %s AND password = %s', (username, password,))
            user = mycursor.fetchone()
            if user:
                session['loggedin'] = True
                session['id'] = user['id']
                session['username'] = user['username']
                session['first'] = user['first']
                session['last'] = user['last']
                return jsonify({
                    "message": "Logged in successfully",
                    "user": {
                        "id": user['id'],
                        "username": user['username'],
                        "first": user['first'],
                        "last": user['last'],
                    }
                    }
                    ), 200
            else:
                return jsonify({'error': 'Invalid login credentials'}), 401


        mycursor.close()
        connection.close()
        

        return jsonify('User registered.')

    except Exception as e:
        return jsonify({'error': str(e)})
    
""" ======================================== RETRIEVE USERS ======================================== """


@app.route('/retrieveusers', methods=['POST'])
def users():
    try:
        req = request.get_json()  
        query = req.get('query')
        if not query:
            return jsonify({'error': 'Request not there'})

        connection = mysql.connector.connect(host='localhost', user='root', password='', database='447')

        if connection.is_connected():
            print('Connected successfully')
        else:
            print('Failed to connect')

        mycursor = connection.cursor(dictionary=True)

        mycursor.execute(query)

        users = mycursor.fetchall()

        mycursor.close()
        connection.close()
        
        response = users
        return response
    except Exception as e:
        return jsonify({'error': str(e)})
    
""" ======================================== RETRIEVE PERSONAL FAVS ======================================== """

@app.route('/retrievefavs', methods=['POST'])
def user_favs():
    try:
        req = request.get_json()  
        username = req.get('username')
        if not username:
            return jsonify({'error': 'Request not there'})

        connection = mysql.connector.connect(host='localhost', user='root', password='', database='447')

        if connection.is_connected():
            print('Connected successfully')
        else:
            print('Failed to connect')

        mycursor = connection.cursor(dictionary=True)
       
        # get fav players
        mycursor.execute(
                f'SELECT np.NAME ' +
                f'FROM fav_players fp ' +
                f'JOIN nbaplayers np ON fp.player_id = np.id ' +
                f'WHERE fp.username = "{username}"' 
            )

        players = mycursor.fetchall()
        # get fav teams
        mycursor.execute(
                f'SELECT nt.NAME ' +
                f'FROM fav_teams fp ' +
                f'JOIN nbateams nt ON fp.team_id = nt.team_id ' +
                f'WHERE fp.username = "{username}"' 
            )

        teams = mycursor.fetchall()

        mycursor.close()
        connection.close()
        
        response = {
            'players': players,
            'teams': teams,
        }
        return response
    except Exception as e:
        return jsonify({'error': str(e)})
    
""" ======================================== FAVORITES ======================================== """

## ------------------------- FAV PLAYERS --------------------------
@app.route('/setfavplayer', methods=['POST'])
def fav_players():
    try:
        fav_data = request.get_json()  
        user_id = fav_data.get('userID')
        username = fav_data.get('username')
        player_id = fav_data.get('playerID')
        method = fav_data.get('type')

        if not fav_data:
            return jsonify({'error': 'Request not there'})

        connection = mysql.connector.connect(host='localhost', user='root', password='', database='447')

        if connection.is_connected():
            print('Connected successfully')
        else:
            print('Failed to connect')

        mycursor = connection.cursor(dictionary=True)
        
        mycursor.execute("SELECT * FROM fav_players WHERE user_id = %s AND player_id = %s", (user_id, player_id))
        user_exists = mycursor.fetchone()
        
        if method == 'add':
                
            if user_exists:
                return jsonify({'error': 'Already favorited'})
                
            mycursor.execute(
                "INSERT INTO fav_players (user_id, username, player_id) VALUES (%s, %s, %s)",
                (user_id, username, player_id)    
        )
            connection.commit()  # cvommit the transaction
            
        else:
            if not user_exists:
                return jsonify({'error': 'Player/Team not favorited'})
            mycursor.execute(
                f"DELETE FROM fav_players WHERE user_id = {user_id} AND player_id = {player_id}"
            )
            

            connection.commit()  

        mycursor.close()
        connection.close()
        
        response = {
          
            'message': f'Successfully {method}ed user: "{username}" favorites with player: {player_id}'
        }
        return response
    
    

    except Exception as e:
        return jsonify({'error': str(e)})
    
#--------------------set fav team--------------------
    
@app.route('/setfavteam', methods=['POST'])
def fav_teams():
    try:
        fav_data = request.get_json()  
        user_id = fav_data.get('userID')
        username = fav_data.get('username')
        team_id = fav_data.get('teamID')
        print(f"team_id = {team_id}")
        method = fav_data.get('type')

        if not fav_data:
            return jsonify({'error': 'Request not there'})

        connection = mysql.connector.connect(host='localhost', user='root', password='', database='447')

        if connection.is_connected():
            print('Connected successfully')
        else:
            print('Failed to connect')

        mycursor = connection.cursor(dictionary=True)
        
        mycursor.execute('SELECT * FROM fav_teams WHERE user_id = %s AND team_id = %s', (user_id, team_id))
        user_exists = mycursor.fetchone()
        
        if method == 'add':
                
            if user_exists:
                return jsonify({'error': 'Already favorited'})
                
            mycursor.execute(
                "INSERT INTO fav_teams (user_id, username, team_id) VALUES (%s, %s, %s)",
                (user_id, username, team_id)    
        )
            connection.commit()  
            
        else:
            if not user_exists:
                return jsonify({'error': 'Player/Team not favorited'})
            mycursor.execute(
                f"DELETE FROM fav_teams WHERE user_id = {user_id} AND team_id = {team_id}"
            )
            

            connection.commit()  #

        mycursor.close()
        connection.close()
        
        response = {
 
            'message': f'Successfully {method}ed team "{team_id}" to user: "{username}" favorites'
        }
        return response
    
    

    except Exception as e:
        return jsonify({'error': str(e)})
    
    # -------------- GET FAV PLAYER -----------------
@app.route('/Userjoin', methods=['POST'])
def Userjoin():
    try:
        fav_data = request.get_json()  
        print(fav_data)
        curr_user = fav_data.get('currUser')
        other_user = fav_data.get('otherUser')
        table = fav_data.get('table')
 
        print(f"curr and other: {curr_user}, {other_user}")
        if not fav_data:
            return jsonify({'error': 'Request not there'})

        connection = mysql.connector.connect(host='localhost', user='root', password='', database='447')

        if connection.is_connected():
            print('Connected successfully')
        else:
            print('Failed to connect')

        mycursor = connection.cursor(dictionary=True)
        if table == 'Players':
            if other_user == 'ALL':
                mycursor.execute(
                    f'SELECT fp.username, np.NAME, np.PPG, np.RPG, np.APG ' +
                    f'FROM fav_players fp ' +
                    f'JOIN fav_players fp2 ON fp.player_id = fp2.player_id  ' +
                    f'JOIN nbaplayers np ON fp.player_id = np.id ' 
                )
            else:
                mycursor.execute(
                    f'SELECT fp.username, np.NAME, np.PPG, np.RPG, np.APG ' +
                    f'FROM fav_players fp ' +
                    f'JOIN fav_players fp2 ON fp.player_id = fp2.player_id  ' +
                    f'JOIN nbaplayers np ON fp.player_id = np.id ' +
                    f'WHERE fp2.username = "{curr_user}" and fp.username = "{other_user}"' 
                )
        elif table == 'Teams':
            if other_user == 'ALL':
                mycursor.execute(
                    f'SELECT fp.username, np.NAME, np.TEAM, np.season ' +
                    f'FROM fav_teams fp ' +
                    f'JOIN fav_teams fp2 ON fp.team_id = fp2.team_id  ' +
                    f'JOIN nbateams np ON fp.team_id = np.team_id ' 
                )
            else:
                mycursor.execute(
                    f'SELECT fp.username, np.NAME, np.TEAM, np.season ' +
                    f'FROM fav_teams fp ' +
                    f'JOIN fav_teams fp2 ON fp.team_id = fp2.team_id  ' +
                    f'JOIN nbateams np ON fp.team_id = np.team_id ' +
                    f'WHERE fp2.username = "{curr_user}" and fp.username = "{other_user}"' 
                )
        
        columns = mycursor.column_names

        data = mycursor.fetchall()

        mycursor.close()
        connection.close()
        
        response = {
            'columns': columns,
            'data': data,
        }
        return response
    
    

    except Exception as e:
        return jsonify({'error': str(e)})
    


if __name__ == '__main__':
    app.run(debug=True)
