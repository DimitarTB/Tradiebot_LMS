from flask import jsonify
from config import db
import datetime
from bson.objectid import ObjectId
class Lecture:
    def __init__(self, name, course_id, dateCreated, files = [], video_file="", watchedBy=[]):
        self.name = name
        self.files = files
        self.comments = []
        self.course_id = course_id
        self.dateCreated = dateCreated
        self.video_file = video_file
        self.watchedBy = watchedBy
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
            ret_lecture = {"_id": lecture_id, "name": data["name"], "course_id": data["course_id"], "dateCreated": data["dateCreated"], "files": data["files"], "video_file": data["video_file"], "watchedBy": data["watchedBy"]}
            return jsonify({"lecture": ret_lecture})
        else:
            course_id = request.args.get("course_id")

            if course_id is not None:
                data = lectures.find({"course_id": course_id})
                ret_lectures = []
                for lecture in data:
                    ret_lectures.append({"_id": str(lecture["_id"]),"name": lecture["name"], "course_id": lecture["course_id"], "dateCreated": lecture["dateCreated"],"files": lecture["files"], "video_file": lecture["video_file"], "watchedBy": lecture["watchedBy"]})
                return jsonify({"lectures": ret_lectures, "course_id": course_id})

            data = lectures.find({})
            ret_lectures = []
            for lecture in data:
                ret_lectures.append({"_id": str(lecture["_id"]),"name": lecture["name"], "course_id": lecture["course_id"], "dateCreated": lecture["dateCreated"],"files": lecture["files"], "video_file": lecture["video_file"], "watchedBy": lecture["watchedBy"]})
            return jsonify(ret_lectures)

    def update(request):
        lectures = db.lectures
        lecture_id = request.args["id"]
        if "file" in request.args:
            data = request.get_json()
            new_files = data["files"]
            print("new_files1", data["files"])
            for file in data["files"]:
                print("ciklus", file)
                lectures.update({"_id": ObjectId(lecture_id)}, { "$push": {"files": file}})
                new_files.append(file)
            print("new_files2", new_files)
            new_lecture = {"_id": lecture_id, "name": data["name"], "course_id": data["course_id"], "dateCreated": data["dateCreated"], "files": data["files"], "video_file": data["video_file"], "watchedBy": data["watchedBy"]}
            return jsonify({"message": "Updated f!","lecture": new_lecture, "lecture_id": lecture_id})
        else:
            data = request.get_json()
            new_lecture = Lecture(data["name"], data["course_id"], data["dateCreated"], data["files"], data["video_file"], data["watchedBy"])
            lectures.update({"_id": ObjectId(lecture_id)}, (new_lecture.__dict__))
            new_lecture = {"_id": lecture_id, "name": data["name"], "course_id": data["course_id"], "dateCreated": data["dateCreated"], "files": data["files"], "video_file": data["video_file"], "watchedBy": data["watchedBy"]}
            return jsonify({"message": "Updated!","lecture": new_lecture, "lecture_id": lecture_id})
        
    def delete(request):
        lecture_id = request.args["id"]
        print(lecture_id)
        lectures = db.lectures
        print(lectures.find_one_and_delete({"_id": ObjectId(lecture_id)}))
        return jsonify({"message": "Deleted!", "id": lecture_id})