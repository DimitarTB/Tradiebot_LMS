from config import db
from flask import jsonify
import datetime
from bson.objectid import ObjectId

class Comment:
    def __init__(self, creator_id, lecture_id, comment, dateCreated, replyTo=""):
        self.creator_id = creator_id
        self.lecture_id = lecture_id
        self.comment = comment
        self.dateCreated = dateCreated
        self.replyTo = replyTo

    def create(request):
            data = request.get_json()
            comments = db.comments

            tNow = datetime.datetime.utcnow()
            print(data)
            new_comment = Comment(data["creator_id"], data["lecture_id"], data["comment"]["comment"], tNow, replyTo=data["replyTo"])
            
            ret_id = comments.insert(new_comment.__dict__)
            new_comment._id = str(new_comment._id)
            return jsonify({
                "message": "success",
                "inserted_id": str(ret_id),
                "comment": new_comment.__dict__
            })

    def read(request):
        lecture_id = request.args.get("lecture_id")
        comments = db.comments
        if lecture_id is not None:
            data = comments.find({"lecture_id": lecture_id})

            ret_comments = []
            for comment in data:
                ret_comments.append({"_id": str(comment["_id"]), "comment": comment["comment"], "creator_id": comment["creator_id"], "dateCreated": comment["dateCreated"], "lecture_id": comment["lecture_id"], "replyTo": comment["replyTo"]})
            return jsonify({"comments": ret_comments, "lecture_id": lecture_id})
        else:
            data = comments.find({})
            ret_comments = []
            for comment in data:
                ret_comments.append({"_id": str(comment["_id"]), "creator_id": comment["creator_id"], "lecture_id": comment["lecture_id"], "comment": comment["comment"], "dateCreated": comment["dateCreated"], "replyTo": comment["replyTo"]})
            return jsonify(ret_comments)
    def delete(request):
        comment_id = request.args.get("id")
        comments = db.comments
        comments.find_one_and_delete({"_id": ObjectId(comment_id)})
        return jsonify({"id": comment_id})
            