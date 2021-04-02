from flask import jsonify
from config import db
import datetime
from bson.objectid import ObjectId
class Quiz:
    def __init__(self, name, topic_id, course_id, completedBy=[], questions=[]):
        self.name = name
        self.topic_id = topic_id
        self.completedBy = completedBy
        self.course_id = course_id
        self.questions = questions
    def create(request):
        data = request.get_json()
        quizzes = db.quizzes
        insert_lect = Quiz(data["name"], data["topic_id"], data["course_id"])
        inserted_id = quizzes.insert(insert_lect.__dict__)
        return jsonify({"quiz": {"name": data["name"], "_id": str(inserted_id), "topic_id": data["topic_id"], "course_id": data["course_id"], "completedBy": [], "questions": []}})
        
    def read(request):
        quiz_id = request.args.get("id")
        quizzes = db.quizzes
        if quiz_id is not None:
            data = quizzes.find_one({"_id": ObjectId(quiz_id)})
            ret_quiz = {"_id": str(data["_id"]), "name": data["name"], "topic_id": data["topic_id"], "course_id": data["course_id"], "completedBy": data["completedBy"], "questions": data["questions"]}
            return jsonify({"quiz": ret_quiz})
        ret_quizzes = []
        data = quizzes.find({})
        for quiz in data:
            print(quiz["_id"])
            ret_quizzes.append({"_id": str(quiz["_id"]), "name": quiz["name"], "topic_id": quiz["topic_id"], "course_id": quiz["course_id"], "completedBy": quiz["completedBy"], "questions": quiz["questions"]})
        return jsonify({"quizzes": ret_quizzes})
    def update(request):
        quiz_id = request.args.get("id")
        if request.args.get("question") is not None:
            data = request.get_json()
            quizzes = db.quizzes
            question = {"index": data["index"], "question": data["question"], "type": data["type"], "public_answers": data["public_answers"], "correct_answers": data["correct_answers"]}
            quizzes.update({"_id": ObjectId(quiz_id)}, {"$push": {"questions": question}})
            return jsonify({"id": quiz_id, "question": question})
        elif request.args.get("rquestion") is not None:
            data = request.get_json()
            quizzes = db.quizzes
            quiz = quizzes.find_one({"_id": ObjectId(quiz_id)})

            questions = quiz["questions"]
            for qs in questions:
                if qs["question"] == data["question"]:
                    questions.remove(qs)

            counter = 0
            for qs in questions:
                qs["index"] = counter
                counter = counter + 1

            question = {"index": data["index"], "question": data["question"], "type": data["type"], "public_answers": data["public_answers"], "correct_answers": data["correct_answers"]}
            quizzes.update({"_id": ObjectId(quiz_id)}, {"$set": {"questions": questions}})
            return jsonify({"id": quiz_id, "question": question})
        else:
            data = request.get_json()
            quizzes = db.quizzes
            quizzes.update({"_id": ObjectId(quiz_id)}, {"$set": {"name": data["name"]}})
            return jsonify({"id": quiz_id, "name": data["name"]})
    def delete(request):
        quiz_id = request.args.get("id")
        quizzes = db.quizzes
        quizzes.find_one_and_delete({"_id": ObjectId(quiz_id)})
        return jsonify({"id": quiz_id})