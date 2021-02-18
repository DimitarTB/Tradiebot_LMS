def methodExec(request, className):
    if request.method == "POST":
        return className.create(request)
    elif request.method == "GET":
        return className.read(request)
    elif request.method == "PUT":
        return className.update(request)
    elif request.method == "DELETE":
        return className.delete(request)