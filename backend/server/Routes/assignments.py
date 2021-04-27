from flask import jsonify
from config import db
import datetime
from bson.objectid import ObjectId


class Assignment:
    def __init__(self, course_id, topic_id, title, description):
        self.course_id = course_id
        self.topic_id = topic_id
        self.title = title
        self.description = description

    def create(request):
        data = request.get_json()
        assignments = db.assignments
        assignment = Assignment(
            data["course_id"], data["topic_id"], data["title"], data["description"]
        )
        inserted_id = assignments.insert(assignment.__dict__)
        return jsonify(
            {
                "_id": str(inserted_id),
                "course_id": data["course_id"],
                "topic_id": data["topic_id"],
                "title": data["title"],
                "description": data["description"],
            }
        )

    def read(request):
        assignments = db.assignments
        data = assignments.find({})
        ret_assignments = []
        for cert in data:
            ret_assignments.append(
                {
                    "_id": str(cert["_id"]),
                    "course_id": cert["course_id"],
                    "topic_id": cert["topic_id"],
                    "title": cert["title"],
                    "description": cert["description"],
                }
            )
        return jsonify(ret_assignments)

    def update(request):
        assignments = db.assignments
        data = request.get_json()
        asn_id = request.args.get("id")
        assignments.update(
            {"_id": ObjectId(asn_id)},
            {"$set": {"title": data["title"], "description": data["description"]}},
        )
        return jsonify(
            {"_id": asn_id, "title": data["title"], "description": data["description"]}
        )

    def delete(request):
        assignments = db.assignments
        asn_id = request.args.get("id")
        assignments.find_one_and_delete({"_id": ObjectId(asn_id)})
        return jsonify({"_id": asn_id})
