from flask import jsonify
from config import db
from bson.objectid import ObjectId
import datetime
import numpy
class Course:
    def __init__(self, name, description, teachers, dateCreated):
        self.name = name
        self.description = description
        self.teachers = teachers
        self.dateCreated = dateCreated

    def create(request):
        userCourse = request.args.get("username")
        cID = request.args.get("course_id")
        if cID is not None and userCourse is not None:
            users = db.users

            users.update({"username": userCourse}, { "$push": {"enrolledCourses": cID}})
            return "updated"

        data = request.get_json()
        courses = db.courses

        tNow = datetime.datetime.utcnow()
        new_course = Course(data["name"], data["description"], data["teachers"], tNow)
        _id = courses.insert(new_course.__dict__)

        users = db.users
        users.update({"username": userCourse}, { "$push": {"createdCourses": (str(_id))}})

        return jsonify({
            "code" : "success",
            "new_course" : str(new_course.__dict__)
        }), 200

    def read(request):
        course_id = request.args.get("id")
        courses = db.courses
        if course_id is not None:
            data = courses.find_one({"_id": ObjectId(course_id)})
            print(data)
            ret_course = Course(data["name"], data["description"], data["teachers"], data["dateCreated"])
            return jsonify({"courses": ret_course.__dict__})
        else:
            userCourse = request.args.get("username")
            if userCourse is not None:
                users = db.users
                data = users.find_one({"username": userCourse})
                ret_courses = []
                for course in data["enrolledCourses"]:
                    ret_course = courses.find_one({"_id": ObjectId(course)})
                    ret_courses.append(ret_course.__dict__)
                return jsonify(ret_courses)
            data = courses.find({})
            ret_courses = []
            for course in data:
                ret_courses.append((Course(course["name"], course["description"], course["teachers"], course["dateCreated"])).__dict__)
            return jsonify(ret_courses)