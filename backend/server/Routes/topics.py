from flask import jsonify
from config import db
from bson.objectid import ObjectId
class Topic:
    def __init__(self, name, course_id, lectures=[]):
        self.name = name
        self.course_id = course_id
        self.lectures = lectures

    def read(request):
        topics = db.topics
        tID = request.args.get("id")
        if tID is not None:
            data = topics.find_one({"_id": ObjectId(tID)})
            return jsonify({"_id": str(data["_id"]), "topic": {"name": data["name"], "course_id": data["course_id"], "lectures": data["lectures"]}})
        data = topics.find({})
        ret_topics = []
        for topic in data:
            ret_topics.append({"_id": str(topic["_id"]), "name": topic["name"], "course_id": topic["course_id"], "lectures": topic["lectures"]})
        return jsonify({"topics": ret_topics})

    def create(request):
        data = request.get_json()
        topics = db.topics
        new_topic = Topic(data["name"], data["course_id"])
        inserted_id = topics.insert(new_topic.__dict__)
        return jsonify({"message": "Topic created!", "topic": {"name": data["name"], "course_id": data["course_id"], "_id": str(inserted_id), "lectures": []}})

    def update(request):
        topics = db.topics
        tID = request.args.get("id")
        data = request.get_json()
        lecture = request.args.get("lecture")
        
        if lecture is not None:
            # for lect in data["lectures"]:
            #     topics.update({"_id": ObjectId(tID)}, {"$push": {"lectures": lect}})
            print(data)
            topics.update({"_id": ObjectId(tID)}, {"$set": {"lectures": data["lectures"]}})
            return jsonify({"message": "Lectures successfully added!", "id": tID, "lectures": data["lectures"]})
        topics.update({"_id": ObjectId(tID)}, {"$set": {"name": data["name"]}})
        return jsonify({"message": "Name successfully changed!", "name": data["name"], "id": tID})

    def delete(request):
        topics = db.topics
        tID = request.args.get("id")
        topics.remove({"_id": ObjectId(tID)})
        return jsonify({"message": "Topic deleted!", "id": tID})