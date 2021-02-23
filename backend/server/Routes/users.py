from flask import jsonify, make_response
from config import db, mail
from werkzeug.security import generate_password_hash
import datetime
import uuid
from flask_mail import Message

class User:
    def __init__(self, username, email, password, types, dateJoined, id = None, rnd = None, enrolledCourses = []):
        self.username = username
        self.email = email
        self.password = password
        self.types = types
        self.createdCourses = []
        self.enrolledCourses = enrolledCourses
        self.dateJoined = dateJoined
        self.activated = False
        self.rnd = rnd
        if id != None:
            self._id = id

    def create(request):
        data = request.get_json()
        users = db.users

        print(data)
        if users.find_one({"username": data["username"]}):
            return make_response(jsonify({"message": "Unique username!!!"}), 401)

        if users.find_one({"email": data["email"]}):
            return make_response(jsonify({"message": "Unique email!!!"}), 401)
        hashed_password = generate_password_hash(data['password'], method='sha256')
        tNow = datetime.datetime.utcnow()
        rnd = str(uuid.uuid4())
        new_user = User(data["username"], data["email"], hashed_password, "Student", tNow, rnd=rnd)
        users.insert(new_user.__dict__)

        msg = Message( 
            'Activate your account', 
            sender ='flaskmailstest@gmail.com', 
            recipients = [new_user.email] 
            ) 
        msg.body = ("Click on the link to activate your account http://127.0.0.1:5000/activate?token=" + rnd + "&user=" + new_user.username)
        mail.send(msg)


        return jsonify({"message": "A mail has been sent to your address with activation link."})

    def read(request):
        usern = request.args.get("username")
        users = db.users
        if usern is not None:
            data = users.find_one({"username": usern})
            ret_user = User(data["username"], data["email"], data["password"], data["types"], data["dateJoined"], enrolledCourses=data["enrolledCourses"])
            return jsonify(ret_user.__dict__)
        else:
            users = users.find({})
            ret_users = []
            for user in users:
                user["_id"] = str(user["_id"])
                ret_users.append(user)
            return jsonify(ret_users)

    