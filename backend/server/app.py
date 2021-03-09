from flask import Flask, request, make_response, abort, jsonify, send_file
from config import app, db, mail, get_random
from Routes.users import User
from Routes.courses import Course
from Routes.lectures import Lecture
from Routes.comments import Comment
from Routes.topics import Topic
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






# User Routes
@app.route('/api/login', methods=["GET", "POST"])
def login():
    users = db.users
    auth = json.loads(request.headers["Authorization"])

    if not auth or not auth["username"] or not auth["password"]:
        return make_response('Could not verify', 401, {'WWW-Authenticate': 'Basic realm="Login Required!"'})

    userJ = users.find_one({"username": auth["username"]})

    if not userJ:
        userJ = users.find_one({"email": auth["username"]})

    user = ({"username": userJ["username"], "email": userJ["email"], "types": userJ["types"], "dateJoined": userJ["dateJoined"], "_id": str(userJ["_id"]), "enrolledCourses": userJ["enrolledCourses"], "createdCourses": userJ["createdCourses"], "activated": userJ["activated"], "profile_picture": userJ["profile_picture"]})
    if not user:
        return make_response('Could not verify', 401, {'WWW-Authenticate': 'Basic realm="Login Required!"'})
    if check_password_hash(userJ["password"], auth["password"]):
        user = user
        print("User : ", user)
        token = create_access_token(identity=user)

        loginTracking = db.login_tracking

        tNow = datetime.datetime.utcnow()
        loginTracking.insert({"username": userJ["username"], "time": tNow})
        return jsonify({'token': token})

    return make_response('Could not verify', 401, {'WWW-Authenticate': 'Basic realm="Login Required!"'})

@app.route('/api/register', methods=["POST"])
def register():
    print(request)
    return methodExec(request, User)

@app.route('/activate')
def sendMail():
    tok = request.args.get("token")
    usr = request.args.get("user")

    users = db.users

    data = users.find_one({"username": usr})

    print(data, type(data))

    if data["rnd"] == tok:
        users.update({"username": usr}, {"$set": {"activated": True}})
        return jsonify({"message": "Your account is successfully activated, you can now log in!"})
    else:
        return jsonify({"message": "Invalid token!"})

@app.route('/api/change_password', methods=["POST"])
@jwt_required
def changePassword():
    data = request.get_json()
    usern = request.args.get("user")
    users = db.users
    user = users.find_one({"username": usern})
    jwt_user = get_jwt_identity()
    if check_password_hash(user["password"], data["currentPassword"]) and jwt_user["username"] == user["username"]:
        users = db.users
        hashed_pw = generate_password_hash(data['newPassword'], method='sha256')
        users.update({"username": user["username"]}, {"$set": {"password": hashed_pw}})
        user["password"] = hashed_pw
        user["_id"] = str(user["_id"])
        return jsonify({"message": "Successfully changed password!", "token": create_access_token(identity=user)})
    print(user["password"], data["currentPassword"])
    print(check_password_hash(user["password"], data["currentPassword"]))
    return make_response(jsonify({"message": "Passwords doesn't match!"}), 401)

@app.route('/api/change_username', methods=["PUT"])
@jwt_required
def changeUsername():
    data = request.get_json()
    usern = request.args.get("user")
    users = db.users
    user = get_jwt_identity()

    if usern != user["username"]:
        return make_response(jsonify({"message": "You cannot perform this function!"}), 401)
    
    users.update({"username": usern}, {"$set": {"username": data["username"]}})
    users.update({"username": usern}, {"$set": {"email": data["email"]}})

    new_user_token = users.find_one({"username": data["username"]})
    new_user_token["_id"] = str(new_user_token["_id"])
    new_user_token.pop("password")
    new_user_token.pop("rnd")
    token = create_access_token(identity=new_user_token)
    return jsonify({"message": "Data updated successfully!", "username": data["username"], "email": data["email"], "token": token})

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








# Teacher routes

@app.route('/api/upload_thumbnail', methods=["POST"])
@jwt_required
def upl_img():
    print(request)
    print("Thumb1")
    c_user = get_jwt_identity()
    if "SuperAdmin" not in c_user["types"] or "Teacher" not in c_user["types"]:
        return jsonify({"message": "You cannot perform that function!"})
    print("Thumb2")
    courses = db.courses
    c_id = request.args.get('course_id')
    print("Thumb3")
    c_course = courses.find_one({"_id": ObjectId(c_id)})
    if str(c_user["_id"]) not in c_course["teachers"] and "SuperAdmin" not in c_user["types"]:
        return jsonify({"message": "You cannot perform that function!"})
    print("Thumb4")

    files = request.files
    print(files)
    image = files["image"]
    name = ("lms/public/thumbnails/" + get_random() + c_id + ".jpg")
    image.save("./static/" + name)
    print("OVDEE")
    print(courses.update({"_id": ObjectId(c_id)}, {"$set": {"thumbnail": name}}))
    return jsonify({"message": "Success!", "course_id": c_id, "thumbnail": name})



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

@app.route('/api/delete_file', methods=["PUT"])
@jwt_required
def del_file():
    print(request)
    data = request.get_json()
    c_user = get_jwt_identity()
    l_id = request.args.get('lecture_id')
    if "SuperAdmin" not in c_user["types"] or "Teacher" not in c_user["types"]:
        return jsonify({"message": "You cannot perform that function!"})
    lectures = db.lectures
    
    lect = lectures.find_one({"_id": ObjectId(l_id)})

    lect_files = lect["files"]
    # for fl, val in lect_files.items():
    #     if val == data["file"]:
    #         lect_files.pop(fl)
    lect_files.remove(data["file"])
    lectures.update({"_id": ObjectId(l_id)}, {"$set": {"files": lect_files}})  
    
    return jsonify({"Message": "Deleted file!", "files": lect_files, "id": l_id})

@app.route("/api/lecture_down", methods=["POST"])
def lecture_down():
    data = request.get_json()
    topics = db.topics
    topic = topics.find_one({"_id": ObjectId(data["topic_id"])})
    print(data)
    a = -1
    counter = 0
    idx = data["index"]

    tList = topic["lectures"]
    if idx == 0:
        tdown = next(item for item in tList if item["index"] == idx)
        tup = next(item for item in tList if item["index"] == (len(topic["lectures"]) - 1))

        tdown.update({"index": (len(topic["lectures"]) - 1)})
        tup.update({"index": idx})
        topics.update({"_id": ObjectId(data["topic_id"])}, {"$set": {"lectures": tList}})
        return jsonify({"message": "True", "id": data["topic_id"], "lectures": tList})
    tdown = next(item for item in tList if item["index"] == idx)
    tup = next(item for item in tList if item["index"] == (idx - 1))

    tdown.update({"index": (idx - 1)})
    tup.update({"index": (idx)})

    topics.update({"_id": ObjectId(data["topic_id"])}, {"$set": {"lectures": tList}})
    return jsonify({"message": "True", "id": data["topic_id"], "lectures": tList})

@app.route("/api/lecture_up", methods=["POST"])
def lecture_up():
    data = request.get_json()
    topics = db.topics
    topic = topics.find_one({"_id": ObjectId(data["topic_id"])})
    idx = data["index"]
    tList = topic["lectures"]

    if idx == (len(tList) - 1):
        tdown = next(item for item in tList if item["index"] == idx)
        tup = next(item for item in tList if item["index"] == 0)
        tdown.update({"index": 0})
        tup.update({"index": (len(tList) - 1)})

        topics.update({"_id": ObjectId(data["topic_id"])}, {"$set": {"lectures": tList}})
        return jsonify({"message": "True", "id": data["topic_id"], "lectures": tList})
    tdown = next(item for item in tList if item["index"] == idx)
    tup = next(item for item in tList if item["index"] == (idx + 1))

    tdown.update({"index": (idx + 1)})
    tup.update({"index": (idx)})

    topics.update({"_id": ObjectId(data["topic_id"])}, {"$set": {"lectures": tList}})
    return jsonify({"message": "True", "id": data["topic_id"], "lectures": tList})

@app.route("/api/topic_down", methods=["POST"])
def topic_down():
    data = request.get_json()
    topics = db.topics
    course_topics = topics.find({"course_id": data["course_id"]})
    idx = int(data["index"])
    if idx == 0:
        for topic in course_topics:
            if topic["index"] == idx:
                tdown = topic
            elif topic["index"] == (course_topics.count() - 1):
                tup = topic
        tdown.update({"index": (course_topics.count() - 1)})
        tup.update({"index": 0})
        topics.replace_one({"_id": tdown["_id"]}, tdown)
        topics.replace_one({"_id": tup["_id"]}, tup)
        return jsonify({"message": "Successfully updated!"})

    for topic in course_topics:
        if topic["index"] == idx:
            tdown = topic
        elif topic["index"] == (idx - 1):
            tup = topic

    tdown.update({"index": (idx - 1)})
    tup.update({"index": idx})

    topics.replace_one({"_id": tdown["_id"]}, tdown)
    topics.replace_one({"_id": tup["_id"]}, tup)

    return jsonify({"message": "Successfully updated!"})

@app.route("/api/topic_up", methods=["POST"])
def topic_up():
    data = request.get_json()
    topics = db.topics
    course_topics = topics.find({"course_id": data["course_id"]})
    idx = int(data["index"])

    if idx == (course_topics.count() - 1):
        for topic in course_topics:
            if topic["index"] == idx:
                tdown = topic
            elif topic["index"] == 0:
                tup = topic
        tdown.update({"index": 0})
        tup.update({"index": idx})
        topics.replace_one({"_id": tdown["_id"]}, tdown)
        topics.replace_one({"_id": tup["_id"]}, tup)

        return jsonify({"message": "Successfully updated!"})

    for topic in course_topics:
        if topic["index"] == idx:
            tdown = topic
        elif topic["index"] == (idx + 1):
            tup = topic

    tdown.update({"index": (idx + 1)})
    tup.update({"index": idx})

    topics.replace_one({"_id": tdown["_id"]}, tdown)
    topics.replace_one({"_id": tup["_id"]}, tup)

    return jsonify({"message": "Successfully updated!"})
    




# Methods / Admin & User

@app.route("/api/user", methods=["GET", "POST", "PUT", "DELETE"])
@jwt_required
def user():
    print(request)

    current_user = get_jwt_identity()

    isAdmin = False

    for admin in current_user["types"]:
        if admin == "SuperAdmin":
            isAdmin = True
    
    if request.method != "GET":
        if isAdmin == False:
            return make_response({"message": "You cannot perform this function!"}, 404)

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
@jwt_required
def lecture():
    print(request)
    return methodExec(request, Lecture)
    
@app.route("/api/comment", methods=["GET", "POST", "PUT", "DELETE"])
@jwt_required
def comment():
    print(request)
    return methodExec(request, Comment)

@app.route("/api/topic", methods=["GET", "POST", "PUT", "DELETE"])
def topic():
    print(request)
    return methodExec(request, Topic)

@app.route("/api/watched_course", methods=["POST"])
@jwt_required
def watched_course():
    user = get_jwt_identity()
    data = request.get_json()
    watchedC = db.courses_tracking
    watchedC.insert({"username": user["username"], "course_id": data["course_id"], "time_watched": data["time_watched"], "started_watching": data["started_watching"] })
    return jsonify({"message": "Record successfully added!"})


@app.route("/api/watched_lecture", methods=["POST"])
@jwt_required
def watched_lecture():
    user = get_jwt_identity()
    data = request.get_json()
    lectures = db.lectures
    lectures.update({"_id": ObjectId(data["id"])}, { "$push": {"watchedBy": str(user["_id"])}})
    
    return jsonify({"message": "Record successfully added!", "lecture_id": data["id"], "user_id": str(user["_id"])})

if __name__ == "__main__":
    app.run(debug=True)