from config import db
from flask import jsonify
import datetime

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
                ret_comments.append((Comment(comment["creator_id"], comment["lecture_id"], comment["comment"], comment["dateCreated"], replyTo=comment["replyTo"])).__dict__)
            return jsonify(ret_comments)
        else:
            data = comments.find({})
            ret_comments = []
            for comment in data:
                ret_comments.append({"_id": str(comment["_id"]), "creator_id": comment["creator_id"], "lecture_id": comment["lecture_id"], "comment": comment["comment"], "dateCreated": comment["dateCreated"], "replyTo": comment["replyTo"]})
            return jsonify(ret_comments)
            