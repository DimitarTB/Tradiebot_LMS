from flask import jsonify
from config import db
import datetime
from bson.objectid import ObjectId
class Certificate:
    def __init__(self, course_id, user_id, data, name, course_name):
        self.course_id = course_id
        self.user_id = user_id
        self.data = data
        self.name = name
        self.course_name = course_name
    def create(request):
        data = request.get_json()
        certificates = db.certificates

        certificate = Certificate(data["course_id"], data["user_id"], data["data"], data["name"], data["course_name"])
        inserted_id = certificates.insert(certificate.__dict__)
        return jsonify({"_id": str(inserted_id), "course_id": data["course_id"], "user_id": data["user_id"], "data": data["data"], "name": data["name"], "course_name": data["course_name"]})
    def read(request):
        user_id = request.args.get("user_id")
        certificates = db.certificates
        if user_id is not None:
            data = certificates.find({"user_id": user_id})
            ret_certificates = []
            for cert in data:
                ret_certificates.append({"_id": str(cert["_id"]), "course_id": cert["course_id"], "user_id": cert["user_id"], "data": cert["data"], "name": cert["name"], "course_name": cert["course_name"]})
            return jsonify(ret_certificates)
        
        data = certificates.find({})
        ret_certificates = []
        for cert in data:
            ret_certificates.append({"_id": str(cert["_id"]), "course_id": cert["course_id"], "user_id": cert["user_id"], "data": cert["data"], "name": cert["name"], "course_name": cert["course_name"]})
        return jsonify(ret_certificates)