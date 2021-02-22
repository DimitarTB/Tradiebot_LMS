from flask import jsonify
from config import db
from bson.objectid import ObjectId
import datetime
import numpy
import json
class Course:
    def __init__(self, name, description, teachers, dateCreated, manualEnroll=True):
        self.name = name
        self.description = description
        self.teachers = teachers
        self.dateCreated = dateCreated
        self.manualEnroll = manualEnroll

    def create(request):
        userCourse = request.args.get("username")
        cID = request.args.get("course_id")
        remove = request.args.get("remove")
        if cID is not None and userCourse is not None:
            users = db.users

            if remove is not None:
                users.update({"username": userCourse}, { "$pull": {"enrolledCourses": cID}})
            else:
                users.update({"username": userCourse}, { "$push": {"enrolledCourses": cID}})
            return jsonify({"_id": cID})

        data = request.get_json()
        courses = db.courses

        tNow = datetime.datetime.utcnow()
        new_course = Course(data["name"], data["description"], data["teachers"], tNow, manualEnroll=data["manualEnroll"])
        _id = courses.insert(new_course.__dict__)

        users = db.users
        users.update({"username": userCourse}, { "$push": {"createdCourses": (str(_id))}})

        return jsonify({
            "code" : "success",
            "new_course" : str(new_course.__dict__),
            "inserted_id": str(_id)
        }), 200

    def read(request):
        course_id = request.args.get("id")
        courses = db.courses
        if course_id is not None:
            data = courses.find_one({"_id": ObjectId(course_id)})
            print(data)
            ret_course = {"_id": course_id, "dateCreated": data["dateCreated"], "description": data["description"], "manualEnroll": data["manualEnroll"], "name": data["name"], "teachers": data["teachers"]}
            return jsonify({"courses": ret_course})
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
                course["_id"] = str(course["_id"])
                ret_courses.append(course)
            return jsonify(ret_courses)

    def update(request):
        # teacher_id = request.args.get("teacher")
        # course_id = request.args.get("course")

        # course_id = ObjectId(course_id)
        # courses = db.courses

        # if teacher_id is not None:
        #     courses.update({"_id": course_id}, { "$push": {"teachers": teacher_id}})
        #     return jsonify({"message": "Updated!", "course": course_id, "teacher": teacher_id})

        # else:
        #     new_name = request.args.get("name")
        #     courses.update({"_id": course_id}, {"$set": {"name": new_name}})
        #     return jsonify({"message": "Updated!", "course": course_id, "name": new_name})
        course_id = request.args.get("course")
        data = request.get_json()
        update_course = Course(data["name"], data["description"], data["teachers"], data["dateCreated"], data["manualEnroll"])
        courses = db.courses

        courses.update({"_id": ObjectId(course_id)}, (update_course.__dict__))
        return jsonify({"message": "Updated!","course": update_course.__dict__, "course_id": course_id})


