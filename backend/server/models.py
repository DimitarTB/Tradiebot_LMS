def methodExec(request, className):
    if request.method == "POST":
        return className.create(request)
    elif request.method == "GET":
        return className.read(request)