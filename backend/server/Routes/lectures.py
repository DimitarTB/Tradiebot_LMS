from flask import jsonify
from config import db
import datetime
from bson.objectid import ObjectId
class Lecture:
    def __init__(self, name, course_id, dateCreated, files = [], video_file=""):
        self.name = name
        self.files = files
        self.comments = []
        self.course_id = course_id
        self.dateCreated = dateCreated
        self.video_file = video_file

    def create(request):
        data = request.get_json()
        lectures = db.lectures
        tNow = datetime.datetime.utcnow()
        new_lecture = Lecture(data["name"], data["course_id"], tNow, video_file = data["video_file"]).__dict__

        inserted_ids = lectures.insert(new_lecture)

        new_lecture = {"_id": str(inserted_ids), "name": data["name"], "course_id": data["course_id"], "dateCreated": tNow, "video_file": data["video_file"] }
        return jsonify({"lecture": new_lecture})

    def read(request):
        lecture_id = request.args.get("id")
        lectures = db.lectures
        if lecture_id is not None:
            data = lectures.find_one({"_id": ObjectId(lecture_id)})
            ret_lecture = {"name": data["name"], "course_id": data["course_id"], "dateCreated": data["dateCreated"], "files": data["files"], "video_file": data["video_file"]}
            return jsonify((ret_lecture.__dict__))
        else:
            course_id = request.args.get("course_id")

            if course_id is not None:
                data = lectures.find({"course_id": course_id})
                ret_lectures = []
                for lecture in data:
                    ret_lectures.append((Lecture(lecture["name"], lecture["course_id"], lecture["dateCreated"], lecture["files"])).__dict__)
                return jsonify(ret_lectures)

            data = lectures.find({})
            ret_lectures = []
            for lecture in data:
                ret_lectures.append({"_id": str(lecture["_id"]),"name": lecture["name"], "course_id": lecture["course_id"], "dateCreated": lecture["dateCreated"],"files": lecture["files"], "video_file": lecture["video_file"]})
            return jsonify(ret_lectures)