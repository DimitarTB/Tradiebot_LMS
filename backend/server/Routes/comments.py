from config import db
from flask import jsonify
import datetime

class Comment:
    def __init__(self, creator_id, lecture_id, comment, dateCreated):
        self.creator_id = creator_id
        self.lecture_id = lecture_id
        self.comment = comment
        self.dateCreated = dateCreated

    def create(request):
            data = request.get_json()
            comments = db.comments

            tNow = datetime.datetime.utcnow()
            new_comment = Comment(data["creator_id"], data["lecture_id"], data["comment"], tNow)
            ret_id = comments.insert(new_comment.__dict__)
            return jsonify({
                "message": "success",
                "inserted_id": str(ret_id)
            })

    def read(request):
        lecture_id = request.args.get("lecture_id")
        comments = db.comments
        if lecture_id is not None:
            data = comments.find({"lecture_id": lecture_id})

            ret_comments = []
            for comment in data:
                ret_comments.append((Comment(comment["creator_id"], comment["lecture_id"], comment["comment"], comment["dateCreated"])).__dict__)
            return jsonify(ret_comments)
        else:
            data = comments.find({})
            ret_comments = []
            for comment in data:
                ret_comments.append((Comment(comment["creator_id"], comment["lecture_id"], comment["comment"], comment["dateCreated"])).__dict__)
            return jsonify(ret_comments)
            