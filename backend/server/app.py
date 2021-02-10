from flask import Flask, request, make_response, abort, jsonify
from config import app, db, mail
from Routes.users import User
from Routes.courses import Course
from Routes.lectures import Lecture
from Routes.comments import Comment
from models import methodExec
import datetime
from flask_mail import Message
import uuid
from flask_jwt_extended import (
    jwt_required, create_access_token,
    get_jwt_identity
)
from werkzeug.security import check_password_hash
import json

@app.route('/activate')
def sendMail():
    tok = request.args.get("token")
    usr = request.args.get("user")

    users = db.users

    data = users.find_one({"username": usr})

    print(data, type(data))

    if data["rnd"] == tok:
        users.update({"username": usr}, {"$set": {"activated": True}})
        return jsonify({"message": "Account successfully activated!"})
    else:
        return jsonify({"message": "Invalid token!"})
@app.route('/api/register', methods=["POST"])
def register():
    print(request)
    return methodExec(request, User)

@app.route('/api/resend', methods=["GET"])
def resend():
    print(request)
    usr = request.args.get("user")
    users = db.users

    print("1")
    data = users.find_one({"username": usr})
    msg = Message( 
        'Activate your account', 
        sender ='flaskmailstest@gmail.com', 
        recipients = [data["email"]]
        ) 
    msg.body = ("Click on the link to activate your account http://127.0.0.1:5000/activate?token=" + data["rnd"] + "&user=" + data["username"])
    mail.send(msg)
    return jsonify({"message": "Resend successfully!"})
@app.route('/api/login', methods=["GET", "POST"])
def login():
    users = db.users
    auth = json.loads(request.headers["Authorization"])

    if not auth or not auth["username"] or not auth["password"]:
        return make_response('Could not verify', 401, {'WWW-Authenticate': 'Basic realm="Login Required!"'})

    userJ = users.find_one({"username": auth["username"]})

    if not userJ:
        userJ = users.find_one({"email": auth["username"]})

    user = User(userJ["username"], userJ["email"], userJ["password"], userJ["types"], userJ["dateJoined"], str(userJ["_id"]), enrolledCourses=userJ["enrolledCourses"])
    if not user:
        return make_response('Could not verify', 401, {'WWW-Authenticate': 'Basic realm="Login Required!"'})
    if check_password_hash(user.password, auth["password"]):
        user = user.__dict__
        print("User : ", user)
        token = create_access_token(identity=user)
        return jsonify({'token': token})

    return make_response('Could not verify', 401, {'WWW-Authenticate': 'Basic realm="Login Required!"'})

@app.route("/api/user", methods=["GET", "POST", "PUT", "DELETE"])
@jwt_required
def user():
    print(request)

    # current_user = get_jwt_identity()

    # isAdmin = False

    # for admin in current_user["types"]:
    #     if admin == "SuperAdmin":
    #         isAdmin = True

    # if isAdmin == False:
    #     return jsonify({"message": "Cannot perform that function!"})

    return methodExec(request, User)

@app.route("/api/course", methods=["GET", "POST", "PUT", "DELETE"])
@jwt_required
def course():
    print(request)
    print("courses")
    return methodExec(request, Course)

@app.route("/api/lecture", methods=["GET", "POST", "PUT", "DELETE"])
# @jwt_required
def lecture():
    print(request)
    return methodExec(request, Lecture)
    
@app.route("/api/comment", methods=["GET", "POST", "PUT", "DELETE"])
@jwt_required
def comment():
    print(request)
    return methodExec(request, Comment)

if __name__ == "__main__":
    app.run(debug=True)