from flask import (
    Flask,
    request,
    make_response,
    abort,
    jsonify,
    send_file,
    redirect,
    flash,
    render_template,
)
from config import app, db, mail, get_random
from Routes.users import User
from Routes.courses import Course
from Routes.lectures import Lecture
from Routes.comments import Comment
from Routes.topics import Topic
from Routes.quizzes import Quiz
from Routes.certificates import Certificate
from Routes.assignments import Assignment
from models import methodExec
import datetime
from flask_mail import Message
import uuid
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from werkzeug.security import check_password_hash, generate_password_hash
import json
from bson.objectid import ObjectId
from bson.json_util import dumps


@app.route("/")
def wel():
    return "Asd"
# User Routes
@app.route("/api/login", methods=["GET", "POST"])
def login():
    users = db.users
    auth = json.loads(request.headers["Authorization"])

    if not auth or not auth["username"] or not auth["password"]:
        return make_response(
            "Could not verify",
            401,
            {"WWW-Authenticate": 'Basic realm="Login Required!"'},
        )

    userJ = users.find_one({"username": auth["username"]})

    if not userJ:
        userJ = users.find_one({"email": auth["username"]})


    user = {
        "username": userJ["username"],
        "email": userJ["email"],
        "types": userJ["types"],
        "dateJoined": userJ["dateJoined"],
        "_id": str(userJ["_id"]),
        "enrolledCourses": userJ["enrolledCourses"],
        "createdCourses": userJ["createdCourses"],
        "activated": userJ["activated"],
        "profile_picture": userJ["profile_picture"],
        "bio": userJ["bio"],
    }
    if not user:
        return make_response(
            "Could not verify",
            401,
            {"WWW-Authenticate": 'Basic realm="Login Required!"'},
        )
    if check_password_hash(userJ["password"], auth["password"]):
        user = user
        token = create_access_token(identity=user)

        loginTracking = db.login_tracking

        tNow = datetime.datetime.utcnow()
        loginTracking.insert({"username": userJ["username"], "time": tNow})
        return jsonify({"token": token})

    return make_response(
        "Could not verify", 401, {"WWW-Authenticate": 'Basic realm="Login Required!"'}
    )


@app.route("/api/register", methods=["POST"])
def register():
    print(request)
    return methodExec(request, User)


@app.route("/activate", methods=["GET"])
def sendMail():
    tok = request.args.get("token")
    usr = request.args.get("user")

    users = db.users

    data = users.find_one({"username": usr})


    if data["rnd"] == tok:
        users.update({"username": usr}, {"$set": {"activated": True}})
        flash("Your account is successfully activated!")
        return render_template("activate_success.html")
    else:
        return render_template("activate_error.html")


@app.route("/api/change_password", methods=["POST"])
@jwt_required
def changePassword():
    data = request.get_json()
    usern = request.args.get("user")
    users = db.users
    user = users.find_one({"username": usern})
    jwt_user = get_jwt_identity()
    if (
        check_password_hash(user["password"], data["currentPassword"])
        and jwt_user["username"] == user["username"]
    ):
        users = db.users
        hashed_pw = generate_password_hash(data["newPassword"], method="sha256")
        users.update({"username": user["username"]}, {"$set": {"password": hashed_pw}})
        user["password"] = hashed_pw
        user["_id"] = str(user["_id"])
        return jsonify(
            {
                "message": "Successfully changed password!",
                "token": create_access_token(identity=user),
            }
        )
    print(user["password"], data["currentPassword"])
    print(check_password_hash(user["password"], data["currentPassword"]))
    return make_response(jsonify({"message": "Passwords doesn't match!"}), 401)


@app.route("/api/change_username", methods=["PUT"])
@jwt_required
def changeUsername():
    data = request.get_json()
    usern = request.args.get("user")
    users = db.users
    user = get_jwt_identity()

    if (
        users.find_one({"username": data["username"]})
        and user["username"] != data["username"]
    ):
        return make_response(
            jsonify({"message": "That username is already in use!"}), 401
        )

    if users.find_one({"email": data["email"]}) and user["email"] != data["email"]:
        return make_response(
            jsonify({"message": "That e-mail is already in use!"}), 401
        )

    if usern != user["username"]:
        return make_response(
            jsonify({"message": "You cannot perform this function!"}), 401
        )

    users.update({"username": usern}, {"$set": {"username": data["username"]}})
    users.update({"username": usern}, {"$set": {"email": data["email"]}})
    users.update({"username": usern}, {"$set": {"bio": data["bio"]}})

    new_user_token = users.find_one({"username": data["username"]})
    new_user_token["_id"] = str(new_user_token["_id"])
    new_user_token.pop("password")
    new_user_token.pop("rnd")
    token = create_access_token(identity=new_user_token)
    return jsonify(
        {
            "message": "Data updated successfully!",
            "username": data["username"],
            "email": data["email"],
            "token": token,
            "bio": data["bio"],
        }
    )


@app.route("/api/change_password_token", methods=["POST"])
def changePasswordToken():
    data = request.get_json()
    tokens = db.tokens
    change_token = tokens.find_one({"username": data["username"]})
    print("tk", change_token)
    if change_token["rnd"] == data["token"]:
        users = db.users
        users.update(
            {"username": data["username"]},
            {
                "$set": {
                    "password": generate_password_hash(
                        data["password"], method="sha256"
                    )
                }
            },
        )
        tokens.find_one_and_delete(change_token)
        return jsonify({"message": "Password successfully updated!"})
    else:
        return make_response({"message": "Invalid token!"}, 401)


@app.route("/api/temporary_password", methods=["POST"])
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
        "Change your password",
        sender="flaskmailstest@gmail.com",
        recipients=[currentUser["email"]],
    )
    msg.body = "Token for changing password for " + currentUser["username"] + ": " + rnd
    mail.send(msg)
    return jsonify({"message": "A token has been sent to your e-mail address!"})


@app.route("/api/profile_picture", methods=["POST"])
@jwt_required
def upload_profile_picture():
    print(request)
    check_user = get_jwt_identity()
    username = request.args.get("user")
    if check_user["username"] != username:
        return jsonify({"message": "You cannot change someone else's profile picture!"})
    files = request.files
    image = files["image"]
    picture_name = "lms/public/profile_pictures/" + get_random() + username + ".jpg"
    image.save(("./static/" + picture_name))
    users = db.users
    print(
        "Upd",
        users.update(
            {"username": username}, {"$set": {"profile_picture": picture_name}}
        ),
    )
    return jsonify(
        {
            "message": "Profile picture changed successfully!",
            "username": username,
            "picture": picture_name,
        }
    )


@app.route("/api/resend", methods=["GET"])
def resend():
    print(request)
    usr = request.args.get("user")
    users = db.users

    print("1")
    data = users.find_one({"username": usr})
    msg = Message(
        "Activate your account",
        sender="flaskmailstest@gmail.com",
        recipients=[data["email"]],
    )
    msg.body = (
        "Click on the link to activate your account http://46.101.200.138:90/activate?token="
        + data["rnd"]
        + "&user="
        + data["username"]
    )
    mail.send(msg)
    return jsonify({"message": "Resend successfully!"})


@app.route("/api/submit_quiz", methods=["POST"])
def submit_quiz():
    print(request)
    quiz_records = db.quiz_records
    data = request.get_json()

    points = 0
    for answer in data["answers"]:
        if answer["correct"] == True:
            points = points + 1

    passed = False
    if points >= (len(data["answers"]) / 2):
        passed = True
    insert_q = {
        "user": data["user_id"],
        "quiz_id": data["quiz_id"],
        "time": datetime.datetime.utcnow(),
        "answers": data["answers"],
        "passed": passed,
        "points": points,
    }
    quiz_records.insert(insert_q)
    get_date = quiz_records.find_one({"_id": insert_q["_id"]})
    insert_q["_id"] = str(insert_q["_id"])
    insert_q["time"] = get_date["time"]
    return jsonify({"message": "Record inserted!", "record": insert_q})


@app.route("/api/assignment_records", methods=["GET"])
@jwt_required
def assignment_records():
    assignment_records = db.assignment_records
    all_records = assignment_records.find({})
    ret_records = []
    for rec in all_records:
        ret_records.append({"_id": str(rec["_id"]), "user_id": rec["user_id"], "assignment_id": rec["assignment_id"], "grade": rec["grade"], "files": rec["files"], "notes": rec["notes"]})
    return jsonify(ret_records)
@app.route("/api/submit_assignment", methods=["POST"])
@jwt_required
def submit_assignment():
    user = get_jwt_identity()
    user_id = request.args.get("user")
    assignment_id = request.args.get("assignment")
    data = {}
    assignment_records = db.assignment_records
    data["user_id"] = user_id
    data["assignment_id"] = assignment_id
    data["grade"] = 0
    data["notes"] = ""
    files = request.files

    files = []
    for file in request.files.getlist("file"):
        filename = "lms/public/assignments/" + get_random() + "_" + file.filename
        file.save(("./static/" + filename))
        files.append(filename)
    data["files"] = files
    assignment_records.insert(data)


    return jsonify({"_id": str(data["_id"]), "assignment_id": data["assignment_id"], "user_id": data["user_id"], "grade": data["grade"], "files": data["files"], "notes": ""})

@app.route("/api/rate_assignment", methods=["POST"])
@jwt_required
def rate_assignment():
    user = get_jwt_identity()
    assignment_records = db.assignment_records
    data = request.get_json()
    assignment_records.update({"_id": ObjectId(data["id"])}, {"$set": {"grade": data["grade"], "notes": data["notes"]}})
    return jsonify({"id": data["id"], "grade": data["grade"], "notes": data["notes"]})



# Teacher routes

@app.route("/api/upload_thumbnail", methods=["POST"])
@jwt_required
def upl_img():
    print(request)
    print("Thumb1")
    c_user = get_jwt_identity()
    if "SuperAdmin" not in c_user["types"] or "Teacher" not in c_user["types"]:
        return jsonify({"message": "You cannot perform that function!"})
    print("Thumb2")
    courses = db.courses
    c_id = request.args.get("course_id")
    print("Thumb3")
    c_course = courses.find_one({"_id": ObjectId(c_id)})
    if (
        str(c_user["_id"]) not in c_course["teachers"]
        and "SuperAdmin" not in c_user["types"]
    ):
        return jsonify({"message": "You cannot perform that function!"})
    print("Thumb4")

    files = request.files
    print(files)
    image = files["image"]
    name = "lms/public/thumbnails/" + get_random() + c_id + ".jpg"
    image.save("./static/" + name)
    print("OVDEE")
    print(courses.update({"_id": ObjectId(c_id)}, {"$set": {"thumbnail": name}}))
    return jsonify({"message": "Success!", "course_id": c_id, "thumbnail": name})


@app.route("/api/upload_file", methods=["POST"])
@jwt_required
def upl_file():
    print(request)
    c_user = get_jwt_identity()
    l_id = request.args.get("lecture_id")
    if "SuperAdmin" not in c_user["types"] or "Teacher" not in c_user["types"]:
        return jsonify({"message": "You cannot perform that function!"})
    lectures = db.lectures

    files = []
    for file in request.files.getlist("file"):
        filename = "lms/public/files/" + get_random() + "_" + file.filename
        file.save(("./static/" + filename))
        files.append(filename)

    print(files)
    for file in files:
        lectures.update({"_id": ObjectId(l_id)}, {"$push": {"files": file}})
    return jsonify({"Message": "Inserted files!", "files": files, "id": l_id})


@app.route("/api/delete_file", methods=["PUT"])
@jwt_required
def del_file():
    print(request)
    data = request.get_json()
    c_user = get_jwt_identity()
    l_id = request.args.get("lecture_id")
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
        tup = next(
            item for item in tList if item["index"] == (len(topic["lectures"]) - 1)
        )

        tdown.update({"index": (len(topic["lectures"]) - 1)})
        tup.update({"index": idx})
        topics.update(
            {"_id": ObjectId(data["topic_id"])}, {"$set": {"lectures": tList}}
        )
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

        topics.update(
            {"_id": ObjectId(data["topic_id"])}, {"$set": {"lectures": tList}}
        )
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
        print(idx)
        for topic in course_topics:
            print(topic["index"])
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


@app.route("/api/public_answer", methods=["POST", "DELETE"])
def public_answer():
    data = request.get_json()
    quizzes = db.quizzes
    if request.method == "POST":
        quiz = quizzes.find_one({"_id": ObjectId(data["quiz_id"])})
        questions = quiz["questions"]
        for quest in questions:
            if quest["index"] == data["index"]:
                quest["public_answers"].append(data["answer"])
        quizzes.update(
            {"_id": ObjectId(data["quiz_id"])}, {"$set": {"questions": questions}}
        )
        return jsonify({"id": data["quiz_id"], "questions": questions})
    quiz = quizzes.find_one({"_id": ObjectId(data["quiz_id"])})
    questions = quiz["questions"]
    for quest in questions:
        if quest["index"] == data["index"]:
            print("Brisi", quest["public_answers"])
            print(data["answer"])
            quest["public_answers"].remove(data["answer"])
    quizzes.update(
        {"_id": ObjectId(data["quiz_id"])}, {"$set": {"questions": questions}}
    )
    return jsonify({"id": data["quiz_id"], "questions": questions})


@app.route("/api/correct_answer", methods=["POST", "DELETE"])
def correct_answer():
    data = request.get_json()
    quizzes = db.quizzes
    if request.method == "POST":
        quiz = quizzes.find_one({"_id": ObjectId(data["quiz_id"])})
        questions = quiz["questions"]
        for quest in questions:
            if quest["index"] == data["index"]:
                quest["correct_answers"].append(data["answer"])
        quizzes.update(
            {"_id": ObjectId(data["quiz_id"])}, {"$set": {"questions": questions}}
        )
        return jsonify({"id": data["quiz_id"], "questions": questions})
    quiz = quizzes.find_one({"_id": ObjectId(data["quiz_id"])})
    questions = quiz["questions"]
    for quest in questions:
        if quest["index"] == data["index"]:
            print("Brisi", quest["correct_answers"])
            print(data["answer"])
            quest["correct_answers"].remove(data["answer"])
    quizzes.update(
        {"_id": ObjectId(data["quiz_id"])}, {"$set": {"questions": questions}}
    )
    return jsonify({"id": data["quiz_id"], "questions": questions})


@app.route("/api/quiz_records", methods=["GET"])
def quiz_records():
    print(request)
    quiz_records = db.quiz_records
    ret = quiz_records.find({})
    json_data = dumps(ret, indent=2)
    return json_data


@app.route("/api/edit_question", methods=["PUT"])
def edit_question():
    print(request)
    data = request.get_json()
    quiz_id = request.args.get("quiz")

    quizzes = db.quizzes
    quiz = quizzes.find_one({"_id": ObjectId(quiz_id)})

    questions = quiz["questions"]
    for qs in questions:
        print(qs["question"])
        print(data["question"])
        if qs["question"] == data["question"]:
            qs["question"] = data["question_name"]
            qs["type"] = data["question_type"]

    print(questions)
    quizzes.update({"_id": ObjectId(quiz_id)}, {"$set": {"questions": questions}})
    return jsonify({"id": quiz_id, "questions": questions})


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

    enroll = request.args.get("username")
    if enroll is None:
        isAdmin = False

        for admin in current_user["types"]:
            if admin == "SuperAdmin":
                isAdmin = True

        if (
            request.method == "POST"
            or request.method == "PUT"
            or request.method == "DELETE"
        ):
            if isAdmin is not True:
                return make_response(
                    "Could not verify",
                    401,
                    {"WWW-Authenticate": 'Basic realm="Login Required!"'},
                )
    print("courses")
    return methodExec(request, Course)


@app.route("/api/lecture", methods=["GET", "POST", "PUT", "DELETE"])
@jwt_required
def lecture():
    print(request)
    print(get_jwt_identity())
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


@app.route("/api/quiz", methods=["GET", "POST", "PUT", "DELETE"])
def quiz():
    print(request)
    return methodExec(request, Quiz)


@app.route("/api/certificate", methods=["GET", "POST", "PUT", "DELETE"])
def certificate():
    print(request)
    return methodExec(request, Certificate)


@app.route("/api/assignment", methods=["GET", "POST", "PUT", "DELETE"])
def assignment():
    print(request)
    return methodExec(request, Assignment)

@app.route("/api/watched_course", methods=["POST"])
@jwt_required
def watched_course():
    user = get_jwt_identity()
    data = request.get_json()
    watchedC = db.courses_tracking
    watchedC.insert(
        {
            "username": user["username"],
            "course_id": data["course_id"],
            "time_watched": data["time_watched"],
            "started_watching": data["started_watching"],
        }
    )
    return jsonify({"message": "Record successfully added!"})


@app.route("/api/watched_lecture", methods=["POST"])
@jwt_required
def watched_lecture():
    user = get_jwt_identity()
    data = request.get_json()
    lectures = db.lectures
    lectures.update(
        {"_id": ObjectId(data["id"])}, {"$push": {"watchedBy": str(user["_id"])}}
    )

    return jsonify(
        {
            "message": "Record successfully added!",
            "lecture_id": data["id"],
            "user_id": str(user["_id"]),
        }
    )


@app.route("/api/change_user_password", methods=["POST"])
@jwt_required
def user_password():
    print(request)
    c_user = get_jwt_identity()
    if "SuperAdmin" not in c_user["types"]:
        return jsonify({"message": "You cannot perform that function!"})
    data = request.get_json()
    users = db.users
    hashed_pw = generate_password_hash(data["password"], method="sha256")
    users.update({"_id": ObjectId(data["id"])}, {"$set": {"password": hashed_pw}})
    return jsonify({"message": "Password successfully changed!"})


@app.route("/api/courses_tracking", methods=["GET"])
@jwt_required
def courses_tracking():
    c_user = get_jwt_identity()
    if "SuperAdmin" not in c_user["types"]:
        return jsonify({"message": "You cannot perform that function!"})

    c_tracking = db.courses_tracking
    all_tracking = c_tracking.find()
    ret_tracking = []
    for track in all_tracking:
        track.pop("_id")
        ret_tracking.append(track)
    print(ret_tracking)
    return jsonify({"tracking": ret_tracking})


@app.route("/api/unenroll_user_course", methods=["POST"])
@jwt_required
def unenroll_user_course():
    c_user = get_jwt_identity()
    if "SuperAdmin" not in c_user["types"]:
        return jsonify({"message": "You cannot perform that function!"})
    data = request.get_json()
    users = db.users
    users.update(
        {"_id": ObjectId(data["user_id"])},
        {"$pull": {"enrolledCourses": data["course_id"]}},
    )

    return jsonify({"user_id": data["user_id"], "course_id": data["course_id"]})


@app.route("/api/enroll_user_course", methods=["POST"])
@jwt_required
def enroll_user_course():
    c_user = get_jwt_identity()
    if "SuperAdmin" not in c_user["types"]:
        return jsonify({"message": "You cannot perform that function!"})
    data = request.get_json()
    users = db.users
    users.update(
        {"_id": ObjectId(data["user_id"])},
        {"$push": {"enrolledCourses": data["course_id"]}},
    )

    return jsonify({"user_id": data["user_id"], "course_id": data["course_id"]})


if __name__ == "__main__":
    app.run(debug=True)
