from flask import Flask, request, make_response, abort, jsonify, send_file
from config import app, db, mail, get_random
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
from werkzeug.security import check_password_hash, generate_password_hash
import json
from bson.objectid import ObjectId

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

@app.route('/api/change_password', methods=["POST"])
@jwt_required
def changePassword():
    data = request.get_json()
    user = get_jwt_identity()
    users = db.users
    if check_password_hash(user["password"], data["currentPassword"]):
        users = db.users
        hashed_pw = generate_password_hash(data['newPassword'], method='sha256')
        users.update({"username": user["username"]}, {"$set": {"password": hashed_pw}})
        user["password"] = hashed_pw
        return jsonify({"message": "Successfully changed password!", "token": create_access_token(identity=user)})
    return make_response(jsonify({"message": "Invalid password!"}), 401)

@app.route('/api/change_password_token', methods=["POST"])
def changePasswordToken():
    data = request.get_json()
    tokens = db.tokens
    change_token = tokens.find_one({"username": data["username"]})
    print("tk", change_token)
    if change_token["rnd"] == data["token"]:
        users = db.users
        users.update({"username": data["username"]}, {"$set": {"password": generate_password_hash(data['password'], method='sha256')}})
        tokens.find_one_and_delete(change_token)
        return jsonify({"message": "Password successfully updated!"})
    else:
        return make_response({"message": "Invalid token!"}, 401)

@app.route('/api/temporary_password', methods=["POST"])
def temporaryPassword():
    usr = request.args.get("user")
    users = db.users
    currentUser = users.find_one({"username": usr})
    if not currentUser:
        currentUser = users.find_one({"email": usr})
    if not currentUser:
        return make_response(jsonify({"message": "That user doesn't exist!"}), 401)
    print("ovde", currentUser)
    tokens = db.tokens
    tokens.find_one_and_delete({"username": currentUser["username"]})
    rnd = str(uuid.uuid4())
    print(tokens.insert({"username": currentUser["username"], "rnd": rnd}))
    msg = Message( 
            'Change your password', 
            sender ='flaskmailstest@gmail.com', 
            recipients = [currentUser["email"]]
            ) 
    msg.body = ("Token for changing password for " + currentUser["username"] + ": " + rnd)
    mail.send(msg)
    return jsonify({"message": "A token has been sent to your e-mail address!"})


@app.route('/api/register', methods=["POST"])
def register():
    print(request)
    return methodExec(request, User)

@app.route('/api/upload_thumbnail', methods=["POST"])
@jwt_required
def upl_img():
    c_user = get_jwt_identity()
    if "SuperAdmin" not in c_user["types"] or "Teacher" not in c_user["types"]:
        return jsonify({"message": "You cannot perform that function!"})
    courses = db.courses
    c_id = request.args.get('course_id')
    c_course = courses.find_one({"_id": ObjectId(c_id)})
    if str(c_user["_id"]) not in c_course["teachers"]:
        return jsonify({"message": "You cannot perform that function!"})
    print(request)

    files = request.files
    print(files)
    image = files["image"]
    name = ("lms/public/thumbnails/" + get_random() + c_id + ".jpg")
    image.save("./static/" + name)
    print("OVDEE")
    print(courses.update({"_id": ObjectId(c_id)}, {"$set": {"thumbnail": name}}))
    return jsonify({"message": "Success!", "course_id": c_id, "thumbnail": name})

@app.route('/api/profile_picture', methods=["POST"])
@jwt_required
def upload_profile_picture():
    print(request)
    check_user = get_jwt_identity()
    username = request.args.get('user')
    if(check_user["username"] != username):
        return jsonify({"message": "You cannot change someone else's profile picture!"})
    print("2")
    files = request.files
    print(files)
    image = files["image"]
    picture_name = ("lms/public/profile_pictures/" + get_random() + username + ".jpg")
    print("3")
    image.save(("./static/" + picture_name))
    print("4")
    users = db.users
    print("Upd", users.update({"username": username}, {"$set": {"profile_picture": picture_name}}))
    return jsonify({"message": "Profile picture changed successfully!", "username": username, "picture": picture_name})
@app.route('/api/upload_file', methods=["POST"])
@jwt_required
def upl_file():
    print(request)
    c_user = get_jwt_identity()
    l_id = request.args.get('lecture_id')
    if "SuperAdmin" not in c_user["types"] or "Teacher" not in c_user["types"]:
        return jsonify({"message": "You cannot perform that function!"})
    lectures = db.lectures
    
    files = []
    for file in request.files.getlist('file'):
        filename = "lms/public/files/" + get_random() + "_" + file.filename
        file.save(("./static/" + filename))
        files.append(filename)    
    
    print(files)
    for file in files:
        lectures.update({"_id": ObjectId(l_id)}, { "$push": {"files": file}})
    return jsonify({"Message": "Inserted files!", "files": files, "id": l_id})

@app.route('/api/get_image', methods=["GET"])
def get_img():
    print(request)
    filename = "./static/lms/public/lp.jpg"
    return send_file(filename, mimetype='image/gif')
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

    user = ({"username": userJ["username"], "email": userJ["email"], "password": userJ["password"], "types": userJ["types"], "dateJoined": userJ["dateJoined"], "_id": str(userJ["_id"]), "enrolledCourses": userJ["enrolledCourses"], "createdCourses": userJ["createdCourses"], "activated": userJ["activated"], "rnd": userJ["rnd"], "profile_picture": userJ["profile_picture"]})
    if not user:
        return make_response('Could not verify', 401, {'WWW-Authenticate': 'Basic realm="Login Required!"'})
    if check_password_hash(user["password"], auth["password"]):
        user = user
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
    current_user = get_jwt_identity()

    isAdmin = False

    for admin in current_user["types"]:
        if admin == "SuperAdmin":
            isAdmin = True

    if request.method is "POST" or request.method is "PUT" or request.method is "DELETE":
        if isAdmin is not True:
            return make_response('Could not verify', 401, {'WWW-Authenticate': 'Basic realm="Login Required!"'})
    print("courses")
    return methodExec(request, Course)

@app.route("/api/lecture", methods=["GET", "POST", "PUT", "DELETE"])
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